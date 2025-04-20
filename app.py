from datetime import timedelta
import psycopg2
import psycopg2.extras
import threading
import re
import logging
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import LoginForm, BibliotecarioRegistroForm, EstudanteRegistroForm
from consulta import update_livro, get_livro_by_id
from emprestimos import atualizar_status_emprestimo, registrar_emprestimo, obter_emprestimos, obter_dados_atuais, excluir_emprestimo, registrar_devolucao
import emailauto

app = Flask(__name__)
app.config['SECRET_KEY'] = 'uma_chave_secreta'
app.config['WTF_CSRF_ENABLED'] = True

logging.basicConfig(filename='app.log', level=logging.INFO)

def get_db_connection():
    conn = psycopg2.connect(
        host='mainline.proxy.rlwy.net',
        dbname='railway',
        user='postgres',
        password='rlKlGNPioeYeFaMeBKdSmrCCUMqOeLOX',
        port='33222'
    )
    conn.autocommit = True  # Opcional: ativa autocommit
    return conn

# Função para iniciar o agendador em segundo plano
def start_email_scheduler():
    # Rodando o agendador em um thread separado
    email_thread = threading.Thread(target=emailauto.run_scheduler)
    email_thread.daemon = True  # Permite que o thread seja encerrado quando o processo principal for encerrado
    email_thread.start()

# Regex simples para validar o formato básico do e-mail
def validar_email(email):
    # Regex simples para verificar o formato básico do e-mail
    regex_simples = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    # Validação com a regex simples
    if not re.match(regex_simples, email):
        return False  # Se não corresponder ao formato básico, retorna False

    # Regex avançada para verificar se o domínio contém erros comuns
    regex_avancada = r'([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)'
    match = re.match(regex_avancada, email)

    if match:
        usuario, dominio = match.groups()

        # Lista de erros comuns nos domínios
        erros_comum = ['gmil', 'educao', 'hotmai', 'outlok']

        # Verificar se o domínio contém um erro comum
        if any(erro in dominio for erro in erros_comum):
            return False  # Se o domínio contiver um erro comum, retorna False

        return True  # E-mail válido

    return False

@app.before_request
def check_session():
    if 'user_agent' not in session:
        session['user_agent'] = request.user_agent.string
    if 'ip' not in session:
        session['ip'] = request.remote_addr
    if session['user_agent'] != request.user_agent.string or session['ip'] != request.remote_addr:
        session.clear()

@app.route('/')
def home():
    if 'user_type' in session:
        if session['user_type'] == 'estudante':
            return redirect(url_for('home_estudante'))
        elif session['user_type'] == 'bibliotecario':
            return redirect(url_for('home_bibliotecario'))
    return render_template('home.html')

@app.route('/home_estudante')
def home_estudante():
    return render_template('home_estudante.html')  # Página inicial para estudantes

@app.route('/home_bibliotecario')
def home_bibliotecario():
    return render_template('home_bibliotecario.html')  # Página inicial para bibliotecários

# Verificar login
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute('SELECT estudante_id, senha_hash FROM estudantes WHERE email = %s', (email,))
        estudante_data = cursor.fetchone()

        if not estudante_data:
            flash("Email ou senha incorretos.")
            conn.close()
            return render_template('login.html', form=form)

        estudante_id_value, senha_hash = estudante_data  # Obtém ID e senha hash

        cursor.execute('SELECT * FROM bibliotecarios WHERE estudante_id = %s', (estudante_id_value,))
        bibliotecario = cursor.fetchone()

        cursor.execute('SELECT * FROM estudantes WHERE estudante_id = %s', (estudante_id_value,))
        estudante = cursor.fetchone()

        # Agora que todas as consultas terminaram, podemos fechar a conexão
        conn.close()

        # Verifica se a senha é correta antes de acessar os dados
        if check_password_hash(senha_hash, password):
            session['user_email'] = email
            session['logged_in'] = True
            session['user_id'] = estudante_id_value

            if bibliotecario:
                session['user_type'] = 'bibliotecario'
                return redirect(url_for('home_bibliotecario'))
            else:
                session['user_type'] = 'estudante'
                return redirect(url_for('home_estudante'))

        flash("Email ou senha incorretos.")
        return render_template('login.html', form=form)

    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    session.clear()  # Limpa todos os dados da sessão
    return redirect(url_for('login'))

@app.route("/registrar_bibliotecario", methods=["GET", "POST"])
def registrar_bibliotecario():
    form = BibliotecarioRegistroForm()
    if form.validate_on_submit():
        email = form.email.data
        matricula = form.matricula.data

        # Validação de e-mail
        if not validar_email(email):
            flash("E-mail inválido!", "error")
            return render_template('registrar_estudante.html', form=form)

        # Conexão com o banco de dados
        conn = get_db_connection()
        conn.autocommit = True  # Adiciona esta linha antes do `cursor = conn.cursor()`
        cursor = conn.cursor()

        try:
            # Verificar se o estudante existe
            print(f"Verificando estudante com matrícula: {matricula}")
            cursor.execute('SELECT estudante_id FROM estudantes WHERE matricula = %s', (matricula,))
            estudante = cursor.fetchone()
            print(f"Resultado da consulta ao estudante: {estudante}")

            if not estudante:
                flash("Nenhum estudante encontrado com essa matrícula. Registre-o primeiro como estudante.", "error")
                print("Nenhum estudante encontrado com a matrícula:", matricula)  # Para depurar
                return render_template("registrar_bibliotecario.html", form=form)
            
            estudante_id = estudante[0]
            print(f"ID do estudante encontrado: {estudante_id}")

            cursor.execute('SELECT * FROM bibliotecarios WHERE estudante_id = %s', (estudante_id,))
            bibliotecario = cursor.fetchone()
            if bibliotecario:
                flash("Este estudante já está registrado como bibliotecário.", "error")
                print("Este estudante já é bibliotecário:", estudante_id)  # Para depurar
                return render_template("registrar_bibliotecario.html", form=form)
            
            # Inserir o estudante como bibliotecário
            cursor.execute(
                'INSERT INTO bibliotecarios (estudante_id, status_bibliotecario) VALUES (%s, %s)',
                (estudante_id, 'ativo')
            )
            conn.commit()
            conn.close()
            print("Bibliotecário registrado com sucesso!")
            flash("Registro de bibliotecário realizado com sucesso!", "success")
            return redirect("/login")

        except psycopg2.DatabaseError as e:
            logging.error(f"Erro de conexão com o banco de dados: {e}")
            raise
        finally:
            conn.close()

    return render_template("registrar_bibliotecario.html", form=form)

@app.route("/registrar_estudante", methods=["GET", "POST"])
def registrar_estudante():
    form = EstudanteRegistroForm()
    if form.validate_on_submit():
        nome = form.nome.data
        email = form.email.data
        senha = form.senha.data
        matricula = form.matricula.data
        turma = form.turma.data
        turno = form.turno.data
        telefone = form.telefone.data

        # Validação de e-mail
        if not validar_email(email):
            flash("E-mail inválido!", "error")
            return render_template('registrar_estudante.html', form=form)

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('''INSERT INTO estudantes (nome, email, senha_hash, matricula, turma, turno, telefone, status)
                              VALUES (%s, %s, %s, %s, %s, %s, %s, %s)''',
                           (nome, email, generate_password_hash(senha), matricula, turma, turno, telefone, 'ativo'))
            conn.commit()
            conn.close()
            flash("Registro de estudante realizado com sucesso!", "success")
            return redirect("/login")
        except psycopg2.DatabaseError as e:
            if "UNIQUE constraint failed: estudantes.email" in str(e):
                flash("Já existe um estudante cadastrado com este email. Por favor, utilize outro.", "error")
            elif "UNIQUE constraint failed: estudantes.matricula" in str(e):
                flash("Já existe um estudante cadastrado com esta matrícula. Por favor, utilize outra.", "error")
            else:
                flash(f"Erro ao registrar estudante: {e}", "danger")
        finally:
            conn.close()

    return render_template('registrar_estudante.html', form=form)

# Função para proteger as rotas
def user_is_logged_in():
    return 'logged_in' in session and session['logged_in']

# Rotas: Estudantes
@app.route('/livros')
def consultar_livros():
    if 'logged_in' in session and session['user_type'] == 'estudante':
        pesquisa = request.args.get('pesquisa', '').strip()

        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Se houver pesquisa, filtramos os livros
        if pesquisa:
            # Verifica se a pesquisa é numérica (ISBN ou ano de publicação)
            if pesquisa.isdigit():
                cursor.execute(
                    '''
                    SELECT * FROM livros 
                    WHERE ano_de_publicacao = %s 
                    OR isbn LIKE %s
                    ''',
                    (pesquisa, f"%{pesquisa}%")
                )
            # Caso contrário, realiza a pesquisa nos campos de texto
            elif pesquisa.lower() in ["disponível", "indisponível"]:  # Verifica se é uma pesquisa de status
                cursor.execute("SELECT * FROM livros WHERE status = %s", (pesquisa,))
            # Passando parâmetros de pesquisa corretamente dentro de uma tupla
            else:
                cursor.execute(
                '''
                SELECT * FROM livros 
                WHERE titulo LIKE %s 
                OR autor LIKE %s 
                OR genero LIKE %s
                ''',
                (f"%{pesquisa}%", f"%{pesquisa}%", f"%{pesquisa}%")
            )
        else:
            # Se não houver pesquisa, mostramos todos os livros
            cursor.execute("SELECT * FROM livros")
        
        livros_encontrados = cursor.fetchall()
        conn.close()

        return render_template('livros.html', livros=livros_encontrados, pesquisa=pesquisa)
    return redirect(url_for('login'))

# Rotas: Bibliotecários
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        if request.method == 'POST':
            # Processar dados enviados no formulário para cadastro
            data = request.form
            tipo = 'livro'  # Assumindo que o tipo de cadastro é sempre 'livro'

            conn = get_db_connection()
            cursor = conn.cursor()
            try:
                if tipo == 'livro':
                    isbn = data.get('isbn', '').strip()
                    cursor.execute('SELECT COUNT(*) FROM livros WHERE isbn = %s', (isbn,))
                    exists = cursor.fetchone()[0]

                    if exists:
                        flash('Já existe um livro cadastrado com este ISBN.', 'danger')
                        return redirect(url_for('cadastro'))
                    if not isbn:
                        flash('O campo ISBN é obrigatório.', 'danger')
                        return redirect(url_for('cadastro'))
                    
                    # Adicionar quantidade_total primeiro
                    quantidade_total = int(data.get('quantidade_total', 0))  # Insira quantidade total primeiro
                    quantidade_disponivel = int(data.get('quantidade_total', 0))

                    cursor.execute('''INSERT INTO livros (titulo, autor, genero, ano_de_publicacao, isbn, status, quantidade_total, quantidade_disponivel, quantidade_indisponivel)
                                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)''',
                                (data['titulo'], data['autor'], data.get('genero', ''), 
                                 data['ano_de_publicacao'], data.get('isbn'), data['status'], quantidade_total, quantidade_disponivel, 0))
                    conn.commit()

                    if not data.get('isbn'):
                        flash('O campo ISBN é obrigatório.', 'danger')
                        return redirect(url_for('cadastro'))


                else:
                    flash('Tipo inválido para cadastro.', 'danger')
                    conn.close()
                    return redirect(url_for('cadastro'))
                
                flash('Cadastro realizado com sucesso!', 'success')
                return redirect(url_for('cadastro'))

            except psycopg2.DatabaseError as e:
                flash(f'Erro ao cadastrar: {e}', 'danger')
                conn.close()
                return redirect(url_for('cadastro'))

        return render_template('cadastro.html')
    return redirect(url_for('login'))

@app.route('/consulta', methods=['GET'])
def consulta():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        tipo = request.args.get("tipo", "livros")  # Padrão: 'livros'
        pesquisa = request.args.get("pesquisa", "").strip()
        param_like = f"%{pesquisa}%"
        param_isbn = pesquisa.replace("-", "")

        try:
            ano = int(pesquisa)
        except ValueError:
            ano = None

        with get_db_connection() as conn:
            cursor = conn.cursor()

            # 🔍 Consulta de livros
            if tipo == 'livros':
                cursor.execute("""
                    SELECT * FROM livros 
                    WHERE (titulo ILIKE %s 
                        OR autor ILIKE %s 
                        OR genero ILIKE %s
                        OR ano_de_publicacao = %s
                        OR isbn ILIKE %s 
                        OR REPLACE(isbn, '-', '') = %s)
                """, (param_like, param_like, param_like, ano, param_like, param_isbn))

                columns = [desc[0] for desc in cursor.description]
                livros = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return render_template("consulta.html", tipo=tipo, livros=livros, pesquisa=pesquisa)

            # 🔍 Consulta de usuários
            elif tipo == 'usuarios':
                cursor.execute("""
                    SELECT e.nome, e.email, 'bibliotecario' AS tipo 
                    FROM bibliotecarios b
                    JOIN estudantes e ON b.estudante_id = e.estudante_id 
                    WHERE e.nome ILIKE %s OR e.email ILIKE %s
                    UNION 
                    SELECT nome, email, 'estudante' AS tipo 
                    FROM estudantes 
                    WHERE nome ILIKE %s OR email ILIKE %s
                """, (param_like, param_like, param_like, param_like))

                columns = [desc[0] for desc in cursor.description]
                usuarios = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return render_template("consulta.html", tipo=tipo, usuarios=usuarios, pesquisa=pesquisa)

            # 🔍 Consulta por status
            elif tipo == 'status':
                if pesquisa.lower() in ["disponível", "indisponível"]:
                    cursor.execute("""
                        SELECT * FROM livros
                        WHERE status = %s
                    """, (pesquisa,))
                    columns = [desc[0] for desc in cursor.description]
                    livros = [dict(zip(columns, row)) for row in cursor.fetchall()]
                    return render_template("consulta.html", tipo=tipo, livros=livros, pesquisa=pesquisa)

        # Caso o tipo seja inválido ou nenhuma correspondência
        return render_template("consulta.html", tipo=tipo, pesquisa=pesquisa)

    # Redireciona para login se não autenticado como bibliotecário
    return redirect(url_for('login'))

@app.route('/apagar_livro/<int:livro_id>', methods=['GET', 'POST'])
def apagar_livro(livro_id):
    print(f"Tentando apagar o livro com ID: {livro_id}")
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM livros WHERE livro_id = %s", (livro_id,))
            conn.commit()
            conn.close()
            print(f"Livro com ID {livro_id} apagado com sucesso.")
        flash("Livro apagado com sucesso!", "success")
        return redirect(url_for('consulta', tipo='livros'))
    print("Usuário não autorizado ou não logado.")
    return redirect(url_for('login'))

@app.route("/editar_livro/<int:livro_id>", methods=["GET", "POST"])
def editar_livro(livro_id):
    print(f"Tentando editar o livro com ID: {livro_id}")
    
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        try:
            titulo = request.form.get("titulo")
            autor = request.form.get("autor")
            genero = request.form.get("genero")
            ano = request.form.get("ano_de_publicacao")
            isbn = request.form.get("isbn")
            status = request.form.get("status")
            quantidade_total = request.form.get("quantidade_total")
            quantidade_disponivel = request.form.get("quantidade_disponivel")
            quantidade_indisponivel = request.form.get("quantidade_indisponivel")

            print("Dados recebidos para atualização:", titulo, autor, genero, ano, isbn, status,
                  quantidade_total, quantidade_disponivel, quantidade_indisponivel)

            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    UPDATE livros SET titulo=%s, autor=%s, genero=%s, ano_de_publicacao=%s, isbn=%s, status=%s,
                    quantidade_total=%s, quantidade_disponivel=%s, quantidade_indisponivel=%s
                    WHERE livro_id=%s
                ''', (titulo, autor, genero, ano, isbn, status,
                      quantidade_total, quantidade_disponivel, quantidade_indisponivel, livro_id))
                conn.commit()
                print(f"Livro com ID {livro_id} atualizado com sucesso.")

            flash("Livro atualizado com sucesso!", "success")
            return redirect(url_for('consulta', tipo='livros'))

        except Exception as e:
            import traceback
            traceback.print_exc()
            print("Erro ao editar livro:", e)
            flash("Erro ao editar o livro.", "danger")
            return redirect(url_for('consulta', tipo='livros'))
    else:
        print("Usuário não autorizado ou não logado.")
        return redirect(url_for('login'))

@app.route('/relatorios', methods=['GET'])
def relatorios():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        # Exemplo de lógica de relatório (contar itens em cada tabela)
        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            # Total de livros
            cursor.execute('SELECT COUNT(*) FROM livros')
            total_livros = cursor.fetchone()[0]
            
            # Total de bibliotecarios e estudantes
            cursor.execute('SELECT COUNT(*) FROM bibliotecarios')
            total_bibliotecarios = cursor.fetchone()[0]
            cursor.execute('SELECT COUNT(*) FROM estudantes')
            total_estudantes = cursor.fetchone()[0]
            
            # Total de livros emprestados e disponíveis
            cursor.execute('''
                           SELECT COUNT(*) FROM livros WHERE status = 'indisponível'
                           ''')
            total_emprestados = cursor.fetchone()[0]
            total_disponiveis = total_livros - total_emprestados

            # Livros mais emprestados
            cursor.execute('''
                SELECT livros.titulo, COUNT(emprestimos.livro_id) AS quantidade_emprestada
                FROM emprestimos
                JOIN livros ON emprestimos.livro_id = livros.livro_id
                WHERE emprestimos.status = 'concluído'
                GROUP BY livros.livro_id
                ORDER BY quantidade_emprestada DESC
            ''')
            livros_mais_emprestados = cursor.fetchall()
            
        except psycopg2.DatabaseError as e:
            flash(f'Erro ao gerar relatório: {e}', 'danger')
            total_livros = total_bibliotecarios = total_estudantes = 0
            total_emprestados = total_disponiveis = 0
            livros_mais_emprestados = []
        
        # Exibir empréstimos concluídos (livros devolvidos)
        try:
            cursor.execute('''
                SELECT 
                    l.titulo, 
                    es.nome AS nome_estudante, 
                    eb.nome AS nome_bibliotecario, 
                    e.data_emprestimo, 
                    e.data_devolucao, 
                    e.data_retorno, 
                    e.status
                FROM 
                    emprestimos e
                JOIN 
                    livros l ON e.livro_id = l.livro_id 
                JOIN 
                    estudantes es ON e.estudante_id = es.estudante_id
                LEFT JOIN 
                    bibliotecarios b ON e.bibliotecario_id = b.estudante_id  -- Relacionando com bibliotecários usando o estudante_id
                LEFT JOIN 
                    estudantes eb ON eb.estudante_id = b.estudante_id  -- Relacionando o bibliotecário com o estudante
                WHERE 
                    e.status = 'concluído';
            ''')
            emprestimos_concluidos = cursor.fetchall()
            emprestimos_concluidos = [dict(row) for row in emprestimos_concluidos]  # Converter para lista de dicionários
            print(emprestimos_concluidos)
        except psycopg2.DatabaseError as e:
            flash(f'Erro ao gerar relatório: {e}', 'danger')
            emprestimos_concluidos = []

        finally:
            conn.close()

        return render_template('relatorios.html', 
                               total_livros=total_livros, 
                               total_bibliotecarios=total_bibliotecarios, 
                               total_estudantes=total_estudantes,
                               total_emprestados=total_emprestados,
                               total_disponiveis=total_disponiveis,
                               livros_mais_emprestados=livros_mais_emprestados,
                               emprestimos_concluidos=emprestimos_concluidos)
    return redirect(url_for('login'))

@app.route('/emprestimos', methods=['GET', 'POST'])
def emprestimos():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        atualizar_status_emprestimo()
        conn = get_db_connection()
        cursor = conn.cursor()

        if request.method == 'POST':
            acao = request.form.get('acao')
            emprestimo_id = request.form.get('emprestimo_id')
            data_retorno = request.form.get('data_retorno')

            # Registrar devolução
            if acao == 'registrar' and emprestimo_id and data_retorno:
                print(f"Registrando devolução: {emprestimo_id}, Data de retorno: {data_retorno}")
                sucesso, mensagem = registrar_devolucao(cursor, conn, emprestimo_id, data_retorno)

                if sucesso:
                    flash(mensagem, 'success')
                else:
                    flash(mensagem, 'danger')
                    print(f"Erro: {mensagem}")

            # Excluir empréstimo
            elif acao == 'excluir' and emprestimo_id:
                sucesso, mensagem = excluir_emprestimo(cursor, conn, emprestimo_id)

                if sucesso:
                    flash(mensagem, 'success')
                else:
                    flash(mensagem, 'danger')

        # Consultar todos os empréstimos ativos
        emprestimos = obter_emprestimos(cursor)
        conn.close()

        return render_template('emprestimos.html', emprestimos=emprestimos)

    return redirect(url_for('login'))

@app.route('/novo_emprestimo', methods=['GET', 'POST'])
def novo_emprestimo():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        conn = get_db_connection()
        cursor = conn.cursor()

        # Obter os dados atuais: livros disponíveis, estudantes e bibliotecários
        livros_disponiveis, estudantes, bibliotecarios = obter_dados_atuais(cursor)

        if request.method == 'POST':
            livro_id = request.form['livro_id']
            estudante_id = request.form['estudante_id']
            bibliotecario_id = request.form['bibliotecario_id']
            data_emprestimo = request.form['data_emprestimo']
            data_devolucao = request.form['data_devolucao']

            # Registrar o novo empréstimo
            sucesso, mensagem = registrar_emprestimo(cursor, conn, livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao)

            flash(mensagem, 'success' if sucesso else 'danger')

            # Redirecionar para a lista de empréstimos após o registro
            return redirect(url_for('emprestimos'))

        conn.close()

        return render_template(
            'novo_emprestimo.html', 
            livros_disponiveis=livros_disponiveis, 
            estudantes=estudantes, 
            bibliotecarios=bibliotecarios
        )
    return redirect(url_for('login'))

# Rodar o app

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1')
    start_email_scheduler()  # Inicia o agendador ao rodar o app

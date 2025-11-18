from datetime import timedelta
import os
from dotenv import load_dotenv
import threading
import re
import logging
import sqlite3
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from forms import LoginForm, BibliotecarioRegistroForm, EstudanteRegistroForm
from consulta import update_livro, get_livro_by_id
from emprestimos import (
    atualizar_status_emprestimo,
    registrar_emprestimo,
    obter_emprestimos,
    obter_dados_atuais,
    excluir_emprestimo,
    registrar_devolucao,
)
import emailauto
from db import get_db_connection

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('MANLIB_SECRET_KEY', 'uma_chave_secreta')
app.config['WTF_CSRF_ENABLED'] = True

logging.basicConfig(filename='app.log', level=logging.INFO)

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Função para iniciar o agendador em segundo plano
def start_email_scheduler():
    email_thread = threading.Thread(target=emailauto.run_scheduler, name="EmailScheduler")
    email_thread.daemon = True
    email_thread.start()

# Regex simples para validar o formato básico do e-mail
def validar_email(email):
    regex_simples = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(regex_simples, email):
        return False

    regex_avancada = r'([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)'
    match = re.match(regex_avancada, email)

    if match:
        usuario, dominio = match.groups()
        erros_comum = ['gmil', 'educao', 'hotmai', 'outlok']
        if any(erro in dominio for erro in erros_comum):
            return False
        return True

    return False

@app.before_request
def check_session():
    # store minimal fingerprint but avoid clearing session on small changes
    if 'user_agent' not in session:
        session['user_agent'] = request.user_agent.string
    if 'ip' not in session:
        session['ip'] = request.remote_addr
    # Do not clear session automatically because it invalidates legitimate users

@app.route('/')
def home():
    if 'logged_in' in session and session['logged_in'] and 'user_type' in session:
        if session['user_type'] == 'estudante':
            return redirect(url_for('consultar_livros'))
        elif session['user_type'] == 'bibliotecario':
            return redirect(url_for('cadastro'))
    return render_template('home.html')

@app.route('/home_estudante')
def home_estudante():
    try:
        print("Acessando rota home_estudante")
        
        if 'logged_in' not in session or not session['logged_in']:
            print("Usuário não está logado. Redirecionando para login.")
            return redirect(url_for('login'))
            
        if 'user_type' not in session or session['user_type'] != 'estudante':
            print(f"Redirecionando usuário do tipo {session.get('user_type')} para a página de livros")
            return redirect(url_for('consultar_livros'))
        
        print(f"Redirecionando para a página de livros para o estudante: {session.get('user_email')}")
        return redirect(url_for('consultar_livros'))
        
    except Exception as e:
        logging.exception("Erro na rota home_estudante")
        flash("Ocorreu um erro ao carregar a página. Por favor, tente novamente.", "error")
        return redirect(url_for('home'))

@app.route('/home_bibliotecario')
def home_bibliotecario():
    try:
        print("Acessando rota home_bibliotecario")
        
        if 'logged_in' not in session or not session['logged_in']:
            print("Usuário não está logado. Redirecionando para login.")
            return redirect(url_for('login'))
            
        if 'user_type' not in session or session['user_type'] != 'bibliotecario':
            print(f"Redirecionando usuário do tipo {session.get('user_type')} para a página de cadastro")
            return redirect(url_for('cadastro'))
        
        print(f"Redirecionando para a página de cadastro para o bibliotecário: {session.get('user_email')}")
        return redirect(url_for('cadastro'))
        
    except Exception as e:
        logging.exception("Erro na rota home_bibliotecario")
        flash("Ocorreu um erro ao carregar a página. Por favor, tente novamente.", "error")

# Verificar login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'logged_in' in session and session['logged_in']:
        if session.get('user_type') == 'estudante':
            return redirect(url_for('consultar_livros'))
        elif session.get('user_type') == 'bibliotecario':
            return redirect(url_for('cadastro'))

    form = LoginForm()

    if form.validate_on_submit():
        try:
            email = form.email.data
            password = form.password.data

            conn = None
            try:
                conn = get_db_connection()
                cursor = conn.cursor()

                cursor.execute('SELECT estudante_id, senha_hash FROM estudantes WHERE email = ?', (email,))
                estudante_data = cursor.fetchone()

                if not estudante_data:
                    flash("Email ou senha incorretos.", "error")
                    return render_template('login.html', form=form)

                # estudante_data é sqlite3.Row → acesso por nome
                estudante_id, senha_hash = estudante_data['estudante_id'], estudante_data['senha_hash']

                cursor.execute('SELECT 1 FROM bibliotecarios WHERE estudante_id = ?', (estudante_id,))
                is_bibliotecario = cursor.fetchone() is not None

                if check_password_hash(senha_hash, password):
                    session.clear()
                    session['user_email'] = email
                    session['logged_in'] = True
                    session['user_id'] = estudante_id
                    session['user_type'] = 'bibliotecario' if is_bibliotecario else 'estudante'

                    if is_bibliotecario:
                        return redirect(url_for('cadastro'))
                    else:
                        return redirect(url_for('consultar_livros'))
                else:
                    flash("Email ou senha incorretos.", "error")
                    return render_template('login.html', form=form)

            except Exception:
                logging.exception("Erro no banco de dados durante login")
                flash("Erro ao acessar o banco de dados. Por favor, tente novamente.", "error")
                return render_template('login.html', form=form)
            finally:
                if conn:
                    conn.close()

        except Exception:
            logging.exception("Erro inesperado durante o login")
            flash("Ocorreu um erro inesperado. Por favor, tente novamente.", "error")
            return render_template('login.html', form=form)

    return render_template('login.html', form=form)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route("/registrar_bibliotecario", methods=["GET", "POST"])
def registrar_bibliotecario():
    form = BibliotecarioRegistroForm()
    if form.validate_on_submit():
        email = form.email.data
        matricula = form.matricula.data

        if not validar_email(email):
            flash("E-mail inválido!", "error")
            return render_template('registrar_bibliotecario.html', form=form)

        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            print(f"Verificando estudante com matrícula: {matricula}")
            cursor.execute('SELECT estudante_id FROM estudantes WHERE matricula = ?', (matricula,))
            estudante = cursor.fetchone()
            print(f"Resultado da consulta ao estudante: {estudante}")

            if not estudante:
                flash("Nenhum estudante encontrado com essa matrícula. Registre-o primeiro como estudante.", "error")
                print("Nenhum estudante encontrado com a matrícula:", matricula)
                return render_template("registrar_bibliotecario.html", form=form)
            
            estudante_id = estudante[0]
            print(f"ID do estudante encontrado: {estudante_id}")

            cursor.execute('SELECT email FROM estudantes WHERE estudante_id = ?', (estudante_id,))
            estudante_email = cursor.fetchone()
            
            if estudante_email and estudante_email[0].lower() != email.lower():
                flash("O e-mail informado não corresponde ao cadastro do estudante.", "error")
                return render_template("registrar_bibliotecario.html", form=form)

            cursor.execute('SELECT * FROM bibliotecarios WHERE estudante_id = ?', (estudante_id,))
            bibliotecario = cursor.fetchone()
            if bibliotecario:
                flash("Este estudante já está registrado como bibliotecário.", "error")
                print("Este estudante já é bibliotecário:", estudante_id)
                return render_template("registrar_bibliotecario.html", form=form)
            
            cursor.execute(
                'INSERT INTO bibliotecarios (estudante_id, status_bibliotecario) VALUES (?, ?)',
                (estudante_id, 'ativo')
            )
            conn.commit()
            flash("Registro de bibliotecário realizado com sucesso!", "success")
            return redirect(url_for('login'))

        except sqlite3.Error as e:
            logging.exception("Erro no banco de dados ao registrar bibliotecario")
            flash("Erro ao processar o registro. Por favor, tente novamente.", "error")
            return render_template("registrar_bibliotecario.html", form=form)
        finally:
            if conn:
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

        if not validar_email(email):
            flash("E-mail inválido!", "error")
            return render_template('registrar_estudante.html', form=form)

        conn = get_db_connection()
        cursor = conn.cursor()
        try:
            cursor.execute('''INSERT INTO estudantes (nome, email, senha_hash, matricula, turma, turno, telefone, status)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                           (nome, email, generate_password_hash(senha), matricula, turma, turno, telefone, 'ativo'))
            conn.commit()
            flash("Registro de estudante realizado com sucesso!", "success")
            return redirect("/login")
        except sqlite3.IntegrityError as e:
            # trata UNIQUE constraint (email/matricula)
            msg = str(e).lower()
            if "unique" in msg and "email" in msg:
                flash("Já existe um estudante cadastrado com este email. Por favor, utilize outro.", "error")
            elif "unique" in msg and "matricula" in msg:
                flash("Já existe um estudante cadastrado com esta matrícula. Por favor, utilize outra.", "error")
            else:
                flash("Erro ao registrar estudante. Verifique os dados e tente novamente.", "error")
        except sqlite3.Error:
            logging.exception("Erro ao acessar o banco ao registrar estudante")
            flash("Erro ao registrar estudante: problema no banco de dados.", "error")
        finally:
            conn.close()

    return render_template('registrar_estudante.html', form=form)

# Função para proteger as rotas
def user_is_logged_in():
    return 'logged_in' in session and session['logged_in']

# Rotas: Estudantes
@app.route('/livros')
def consultar_livros():
    try:
        if 'logged_in' not in session or not session['logged_in'] or session.get('user_type') != 'estudante':
            flash("Acesso não autorizado. Por favor, faça login como estudante.", "error")
            return redirect(url_for('login'))
            
        pesquisa = request.args.get('pesquisa', '').strip()
        conn = get_db_connection()
        
        try:
            if pesquisa:
                if pesquisa.isdigit():
                    cursor = conn.execute(
                        '''
                        SELECT * FROM livros 
                        WHERE CAST(ano_de_publicacao AS TEXT) = ? 
                        OR isbn LIKE ?
                        ''',
                        (pesquisa, f"%{pesquisa}%")
                    )
                elif pesquisa.lower() in ["disponível", "indisponível"]:
                    cursor = conn.execute("SELECT * FROM livros WHERE status = ?", (pesquisa,))
                else:
                    cursor = conn.execute(
                        '''
                        SELECT * FROM livros 
                        WHERE titulo LIKE ? 
                        OR autor LIKE ? 
                        OR genero LIKE ?
                        ''',
                        (f"%{pesquisa}%", f"%{pesquisa}%", f"%{pesquisa}%")
                    )
            else:
                cursor = conn.execute("SELECT * FROM livros")
            
            livros = cursor.fetchall()
            livros = [dict(livro) for livro in livros]
            
            return render_template('livros.html', livros=livros, pesquisa=pesquisa)
            
        except sqlite3.Error:
            logging.exception("Erro no banco de dados em consultar_livros")
            flash("Erro ao acessar o banco de dados. Por favor, tente novamente.", "error")
            return redirect(url_for('home_estudante'))
            
        finally:
            conn.close()
            
    except Exception:
        logging.exception("Erro inesperado em consultar_livros")
        flash("Ocorreu um erro inesperado. Por favor, tente novamente.", "error")
        return redirect(url_for('home_estudante'))

# Rotas: Bibliotecários
@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        if request.method == 'POST':
            data = request.form
            tipo = 'livro'

            conn = get_db_connection()
            cursor = conn.cursor()
            try:
                if tipo == 'livro':
                    isbn = data.get('isbn', '').strip()
                    cursor.execute('SELECT COUNT(*) FROM livros WHERE isbn = ?', (isbn,))
                    exists = cursor.fetchone()[0]

                    if exists:
                        flash('Já existe um livro cadastrado com este ISBN.', 'danger')
                        return redirect(url_for('cadastro'))
                    if not isbn:
                        flash('O campo ISBN é obrigatório.', 'danger')
                        return redirect(url_for('cadastro'))
                    
                    quantidade_total = int(data.get('quantidade_total', 0))
                    quantidade_disponivel = int(data.get('quantidade_total', 0))

                    cursor.execute('''INSERT INTO livros (titulo, autor, genero, ano_de_publicacao, isbn, status, quantidade_total, quantidade_disponivel, quantidade_indisponivel)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                                (data['titulo'], data['autor'], data.get('genero', ''), 
                                 data['ano_de_publicacao'], data.get('isbn'), data['status'], quantidade_total, quantidade_disponivel, 0))
                    conn.commit()

                else:
                    flash('Tipo inválido para cadastro.', 'danger')
                    conn.close()
                    return redirect(url_for('cadastro'))
                
                flash('Cadastro realizado com sucesso!', 'success')
                return redirect(url_for('cadastro'))

            except sqlite3.IntegrityError as e:
                logging.exception("Erro de integridade ao cadastrar livro")
                flash(f'Erro ao cadastrar: {e}', 'danger')
                conn.close()
                return redirect(url_for('cadastro'))
            except sqlite3.Error:
                logging.exception("Erro no banco ao cadastrar livro")
                flash('Erro ao cadastrar. Por favor, tente novamente.', 'danger')
                conn.close()
                return redirect(url_for('cadastro'))
            finally:
                if conn:
                    conn.close()

        return render_template('cadastro.html')
    return redirect(url_for('login'))

@app.route('/consulta', methods=['GET'])
def consulta():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        tipo = request.args.get("tipo", "livros")
        pesquisa = request.args.get("pesquisa", "").strip()
        param_like = f"%{pesquisa}%"
        param_isbn = pesquisa.replace("-", "")

        try:
            ano = int(pesquisa)
        except ValueError:
            ano = None

        with get_db_connection() as conn:
            cursor = conn.cursor()

            if tipo == 'livros':
                cursor.execute("""
                    SELECT * FROM livros 
                    WHERE (titulo LIKE ? 
                        OR autor LIKE ? 
                        OR genero LIKE ?
                        OR ano_de_publicacao = ?
                        OR isbn LIKE ? 
                        OR REPLACE(isbn, '-', '') = ?)
                """, (param_like, param_like, param_like, ano, param_like, param_isbn))

                columns = [desc[0] for desc in cursor.description]
                livros = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return render_template("consulta.html", tipo=tipo, livros=livros, pesquisa=pesquisa)

            elif tipo == 'usuarios':
                cursor.execute("""
                    SELECT e.nome, e.email, 'bibliotecario' AS tipo 
                    FROM bibliotecarios b
                    JOIN estudantes e ON b.estudante_id = e.estudante_id 
                    WHERE e.nome LIKE ? OR e.email LIKE ?
                    UNION 
                    SELECT nome, email, 'estudante' AS tipo 
                    FROM estudantes 
                    WHERE nome LIKE ? OR email LIKE ?
                """, (param_like, param_like, param_like, param_like))

                columns = [desc[0] for desc in cursor.description]
                usuarios = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return render_template("consulta.html", tipo=tipo, usuarios=usuarios, pesquisa=pesquisa)

            elif tipo == 'status':
                if pesquisa.lower() in ["disponível", "indisponível"]:
                    cursor.execute("""
                        SELECT * FROM livros
                        WHERE status = ?
                    """, (pesquisa,))
                    columns = [desc[0] for desc in cursor.description]
                    livros = [dict(zip(columns, row)) for row in cursor.fetchall()]
                    return render_template("consulta.html", tipo=tipo, livros=livros, pesquisa=pesquisa)

        return render_template("consulta.html", tipo=tipo, pesquisa=pesquisa)

    return redirect(url_for('login'))

@app.route('/apagar_livro/<int:livro_id>', methods=['GET', 'POST'])
def apagar_livro(livro_id):
    print(f"Tentando apagar o livro com ID: {livro_id}")
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM livros WHERE livro_id = ?", (livro_id,))
            conn.commit()
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
                    UPDATE livros SET titulo=?, autor=?, genero=?, ano_de_publicacao=?, isbn=?, status=?,
                    quantidade_total=?, quantidade_disponivel=?, quantidade_indisponivel=?
                    WHERE livro_id=?
                ''', (titulo, autor, genero, ano, isbn, status,
                      quantidade_total, quantidade_disponivel, quantidade_indisponivel, livro_id))
                conn.commit()
                print(f"Livro com ID {livro_id} atualizado com sucesso.")

            flash("Livro atualizado com sucesso!", "success")
            return redirect(url_for('consulta', tipo='livros'))

        except Exception:
            logging.exception("Erro ao editar livro")
            flash("Erro ao editar o livro.", "danger")
            return redirect(url_for('consulta', tipo='livros'))
    else:
        print("Usuário não autorizado ou não logado.")
        return redirect(url_for('login'))

@app.route('/relatorios')
def relatorios():
    try:
        if 'logged_in' not in session or not session['logged_in']:
            flash("Por favor, faça login para acessar esta página.", "error")
            return redirect(url_for('login'))

        if 'user_type' not in session or session['user_type'] != 'bibliotecario':
            flash("Acesso negado. Apenas bibliotecários podem acessar esta página.", "error")
            return redirect(url_for('home'))

        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Totais básicos
            cursor.execute("SELECT COUNT(*) FROM livros")
            total_livros = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM bibliotecarios")
            total_bibliotecarios = cursor.fetchone()[0] or 0

            cursor.execute("SELECT COUNT(*) FROM estudantes")
            total_estudantes = cursor.fetchone()[0] or 0

            # Total emprestados (status 'ativo' — ajuste o texto se seu DB usar outro)
            cursor.execute("SELECT COUNT(*) FROM emprestimos WHERE status = 'ativo'")
            total_emprestados = cursor.fetchone()[0] or 0

            # Total disponíveis (ajuste 'disponível' vs 'disponivel' conforme seu DB)
            # Verifique qual string seu DB usa; aqui eu tento as duas possibilidades
            cursor.execute("SELECT COUNT(*) FROM livros WHERE status = 'disponível'")
            total_disponiveis = cursor.fetchone()[0]
            if total_disponiveis is None:
                total_disponiveis = 0

            # Livros mais emprestados (já com nome correto da coluna de contagem)
            cursor.execute("""
                SELECT l.livro_id, l.titulo, l.autor, COUNT(e.emprestimo_id) AS quantidade_emprestimos
                FROM livros l
                LEFT JOIN emprestimos e ON l.livro_id = e.livro_id
                GROUP BY l.livro_id
                ORDER BY quantidade_emprestimos DESC
                LIMIT 10
            """)
            livros_mais_emprestados = cursor.fetchall()

            # Relatório de empréstimos concluídos
            # Observação: sua estrutura original usa bibliotecarios(estudante_id) -> estudantes.nome
            # Então fazemos LEFT JOIN em bibliotecarios e depois JOIN em estudantes para pegar o nome
            cursor.execute("""
                SELECT
                    e.emprestimo_id,
                    l.titulo,
                    es.nome AS nome_estudante,
                    eb.nome AS nome_bibliotecario,
                    e.data_emprestimo,
                    e.data_devolucao,
                    e.data_retorno,
                    e.status
                FROM emprestimos e
                JOIN livros l ON e.livro_id = l.livro_id
                JOIN estudantes es ON e.estudante_id = es.estudante_id
                LEFT JOIN bibliotecarios b ON e.bibliotecario_id = b.estudante_id
                LEFT JOIN estudantes eb ON b.estudante_id = eb.estudante_id
                WHERE e.status = 'concluído' OR e.status = 'concluido'
                ORDER BY e.data_retorno DESC
            """)
            emprestimos_concluidos = cursor.fetchall()

            return render_template(
                'relatorios.html',
                total_livros=total_livros,
                total_bibliotecarios=total_bibliotecarios,
                total_estudantes=total_estudantes,
                total_emprestados=total_emprestados,
                total_disponiveis=total_disponiveis,
                livros_mais_emprestados=livros_mais_emprestados,
                emprestimos_concluidos=emprestimos_concluidos
            )

    except Exception as e:
        # Log completo do erro para você ver no arquivo de logs ou console do Railway
        logging.exception("Erro inesperado na rota de relatórios")
        # também imprime no console para facilitar debug no deploy
        print("ERRO /relatorios:", e)
        flash("Ocorreu um erro inesperado. Por favor, tente novamente.", "error")
        return redirect(url_for('home'))

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

            if acao == 'registrar' and emprestimo_id and data_retorno:
                print(f"Registrando devolução: {emprestimo_id}, Data de retorno: {data_retorno}")
                sucesso, mensagem = registrar_devolucao(cursor, conn, emprestimo_id, data_retorno)

                if sucesso:
                    flash(mensagem, 'success')
                else:
                    flash(mensagem, 'danger')
                    print(f"Erro: {mensagem}")

            elif acao == 'excluir' and emprestimo_id:
                sucesso, mensagem = excluir_emprestimo(cursor, conn, emprestimo_id)

                if sucesso:
                    flash(mensagem, 'success')
                else:
                    flash(mensagem, 'danger')

        emprestimos = obter_emprestimos(cursor)
        conn.close()

        return render_template('emprestimos.html', emprestimos=emprestimos)

    return redirect(url_for('login'))

@app.route('/novo_emprestimo', methods=['GET', 'POST'])
def novo_emprestimo():
    if 'logged_in' in session and session['user_type'] == 'bibliotecario':
        conn = get_db_connection()
        cursor = conn.cursor()

        livros_disponiveis, estudantes, bibliotecarios = obter_dados_atuais(cursor)

        if request.method == 'POST':
            livro_id = request.form['livro_id']
            estudante_id = request.form['estudante_id']
            bibliotecario_id = request.form['bibliotecario_id']
            data_emprestimo = request.form['data_emprestimo']
            data_devolucao = request.form['data_devolucao']

            sucesso, mensagem = registrar_emprestimo(cursor, conn, livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao)

            flash(mensagem, 'success' if sucesso else 'danger')
            return redirect(url_for('emprestimos'))

        conn.close()

        return render_template(
            'novo_emprestimo.html', 
            livros_disponiveis=livros_disponiveis, 
            estudantes=estudantes, 
            bibliotecarios=bibliotecarios
        )
    return redirect(url_for('login'))

if __name__ == "__main__":
    # Start scheduler before running the Flask server so o thread já exista
    start_email_scheduler()
    app.run(debug=True, host='127.0.0.1', threaded=True)

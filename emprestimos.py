from datetime import datetime
import sqlite3

# Função para conexão com o banco de dados
def get_db_connection():
    conn = sqlite3.connect('manlib.db')
    conn.row_factory = sqlite3.Row
    return conn

def atualizar_status_emprestimo():
    # Conectar ao banco de dados para verificar as credenciais
    conn = get_db_connection()
    cursor = conn.cursor()

    # Obter a data atual
    data_atual = datetime.now().date()

    # Atualiza os status com base na data de devolução
    cursor.execute('''
        UPDATE emprestimos 
        SET status = CASE
            WHEN data_devolucao < ? THEN 'atrasado'
            ELSE 'ativo'
        END
        WHERE status != 'concluído';
    ''', (data_atual,))

    # Atualiza o status do livro baseado na quantidade disponível
    cursor.execute('''
        UPDATE livros
        SET status = CASE
            WHEN quantidade_disponivel = 0 THEN 'indisponível'
            ELSE 'disponível'
        END
    ''')

    conn.commit()
    conn.close()

    # Função para obter todos os empréstimos
def obter_emprestimos(cursor):
    cursor.execute("""
        SELECT 
        emprestimos.emprestimo_id,
        livros.titulo AS livro_titulo,
        estudantes.nome AS estudante_nome,
        b.nome AS bibliotecario_nome,
        emprestimos.data_emprestimo,
        emprestimos.data_devolucao,
        emprestimos.status
    FROM 
        emprestimos
    JOIN 
        livros ON emprestimos.livro_id = livros.livro_id
    JOIN 
        estudantes ON emprestimos.estudante_id = estudantes.estudante_id
    LEFT JOIN 
        estudantes b ON emprestimos.bibliotecario_id = b.estudante_id  -- LEFT JOIN permite valores nulos no bibliotecário
    WHERE
        emprestimos.status != 'concluído';
    """)
    return cursor.fetchall()

# Função para registrar devolução
def registrar_devolucao(cursor, conn, emprestimo_id, data_retorno):
    try:
        # Validar o formato da data
        data_retorno = datetime.strptime(data_retorno, '%Y-%m-%d').date()

        # Obter o livro_id relacionado ao empréstimo
        cursor.execute("""
            SELECT livro_id FROM emprestimos WHERE emprestimo_id = ?
        """, (emprestimo_id,))
        livro_id = cursor.fetchone()

        if livro_id:
            livro_id = livro_id[0]

            # Atualizar status do empréstimo para 'concluído' e registrar a data de devolução
            cursor.execute("""
                UPDATE emprestimos SET status = ?, data_retorno = ? WHERE emprestimo_id = ?
            """, ('concluído', data_retorno, emprestimo_id))
            conn.commit()

            # Atualizar as quantidades de livros
            cursor.execute("""
                UPDATE livros
                SET 
                    quantidade_disponivel = quantidade_disponivel + 1,
                    quantidade_indisponivel = quantidade_indisponivel - 1,
                    status = CASE
                        WHEN quantidade_disponivel + 1 > 0 THEN 'disponível'
                        ELSE 'indisponível'
                    END
                WHERE livro_id = ?
            """, (livro_id,))
            conn.commit()

            return True, 'Devolução registrada com sucesso.'
        else:
            return False, "Empréstimo não encontrado."
    except Exception as e:
        print(f"Erro ao registrar devolução: {e}")
        conn.rollback()
        return False, f'Erro ao registrar devolução: {str(e)}'
    
# Função para excluir empréstimo
def excluir_emprestimo(cursor, conn, emprestimo_id):
    try:
        # Obter o livro_id relacionado ao empréstimo antes de excluí-lo
        cursor.execute("""
            SELECT livro_id FROM emprestimos WHERE emprestimo_id = ?
        """, (emprestimo_id,))
        livro_id = cursor.fetchone()

        if livro_id:
            livro_id = livro_id[0]

            # Excluir o empréstimo
            cursor.execute("DELETE FROM emprestimos WHERE emprestimo_id = ?", (emprestimo_id,))
            conn.commit()

            # Atualizar status do livro para 'disponível'
            cursor.execute("""
                UPDATE livros
                SET status = 'disponível'
                WHERE livro_id = ?
            """, (livro_id,))
            conn.commit()

            return True, "Empréstimo excluído com sucesso!"
        else:
            return False, "Empréstimo não encontrado."
    except Exception as e:
        conn.rollback()
        return False, f"Erro ao excluir empréstimo: {str(e)}"

# Função para registrar empréstimo
def registrar_emprestimo(cursor, conn, livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao):
    # Verificar se o livro tem quantidade disponível
    cursor.execute("SELECT quantidade_disponivel FROM livros WHERE livro_id = ?", (livro_id,))
    quantidade_disponivel = cursor.fetchone()[0]

    if quantidade_disponivel > 0:
        # Registrar o empréstimo
        cursor.execute("""
            INSERT INTO emprestimos (livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao, status)
            VALUES (?, ?, ?, ?, ?, 'ativo');
        """, (livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao))

        # Atualizar a quantidade disponível e indisponível
        cursor.execute("""
            UPDATE livros
            SET quantidade_disponivel = quantidade_disponivel - 1,
                quantidade_indisponivel = quantidade_indisponivel + 1
            WHERE livro_id = ?;
        """, (livro_id,))

        # Commit para salvar as mudanças no banco
        conn.commit()

        return True, 'Empréstimo registrado com sucesso.'
    else:
        return False, 'Não há livros disponíveis para emprestar.'

# Função para obter os livros disponíveis, estudantes e bibliotecários
def obter_dados_atuais(cursor):
    # Consultar livros disponíveis
    cursor.execute("SELECT livro_id, titulo FROM livros WHERE status = 'disponível'")
    livros_disponiveis = cursor.fetchall()

    # Consultar estudantes
    cursor.execute("SELECT estudante_id, nome FROM estudantes")
    estudantes = cursor.fetchall()

    # Consultar bibliotecários
    cursor.execute("""
        SELECT b.estudante_id AS bibliotecario_id, e.nome 
        FROM bibliotecarios b
        JOIN estudantes e ON b.estudante_id = e.estudante_id
    """)
    bibliotecarios = cursor.fetchall()

    return livros_disponiveis, estudantes, bibliotecarios

from datetime import datetime
from db import get_db_connection


def atualizar_status_emprestimo():
    with get_db_connection() as conn:
        cursor = conn.cursor()

        data_atual = datetime.now().date()

        cursor.execute('''
            UPDATE emprestimos
            SET status = CASE
                WHEN date(data_devolucao) < date(?) THEN 'atrasado'
                ELSE 'ativo'
            END
            WHERE status != 'concluído'
        ''', (data_atual,))

        cursor.execute('''
            UPDATE livros
            SET status = CASE
                WHEN quantidade_disponivel = 0 THEN 'indisponível'
                ELSE 'disponível'
            END
        ''')

        conn.commit()


def obter_emprestimos(cursor):
    cursor.execute("""
        SELECT 
            e.emprestimo_id,
            l.titulo AS livro_titulo,
            es.nome AS estudante_nome,
            eb.nome AS bibliotecario_nome,
            e.data_emprestimo,
            e.data_devolucao,
            e.status
        FROM emprestimos e
        JOIN livros l ON e.livro_id = l.livro_id
        JOIN estudantes es ON e.estudante_id = es.estudante_id
        LEFT JOIN bibliotecarios b ON e.bibliotecario_id = b.estudante_id
        LEFT JOIN estudantes eb ON b.estudante_id = eb.estudante_id
        WHERE e.status != 'concluído'
        ORDER BY e.data_emprestimo DESC
    """)
    colunas = [desc[0] for desc in cursor.description]
    return [dict(zip(colunas, row)) for row in cursor.fetchall()]


def registrar_devolucao(cursor, conn, emprestimo_id, data_retorno):
    try:
        data_retorno = datetime.strptime(data_retorno, '%Y-%m-%d').date()

        cursor.execute("""
            SELECT livro_id FROM emprestimos WHERE emprestimo_id = ?
        """, (emprestimo_id,))
        row = cursor.fetchone()

        if row:
            livro_id = row[0]

            cursor.execute("""
                UPDATE emprestimos SET status = ?, data_retorno = ? WHERE emprestimo_id = ?
            """, ('concluído', data_retorno, emprestimo_id))
            conn.commit()

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


def excluir_emprestimo(cursor, conn, emprestimo_id):
    try:
        cursor.execute("""
            SELECT livro_id FROM emprestimos WHERE emprestimo_id = ?
        """, (emprestimo_id,))
        row = cursor.fetchone()

        if row:
            livro_id = row[0]

            cursor.execute("DELETE FROM emprestimos WHERE emprestimo_id = ?", (emprestimo_id,))
            conn.commit()

            cursor.execute("""
                UPDATE livros
                SET quantidade_indisponivel = max(0, quantidade_indisponivel - 1),
                    quantidade_disponivel = quantidade_disponivel + 1,
                    status = CASE WHEN quantidade_disponivel + 1 > 0 THEN 'disponível' ELSE 'indisponível' END
                WHERE livro_id = ?
            """, (livro_id,))
            conn.commit()

            return True, "Empréstimo excluído com sucesso!"
        else:
            return False, "Empréstimo não encontrado."
    except Exception as e:
        conn.rollback()
        return False, f"Erro ao excluir empréstimo: {str(e)}"


def registrar_emprestimo(cursor, conn, livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao):
    cursor.execute("SELECT quantidade_disponivel FROM livros WHERE livro_id = ?", (livro_id,))
    row = cursor.fetchone()
    if not row:
        return False, 'Livro não encontrado.'

    quantidade_disponivel = row[0]

    if quantidade_disponivel > 0:
        cursor.execute("""
            INSERT INTO emprestimos (livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao, status)
            VALUES (?, ?, ?, ?, ?, 'ativo')
        """, (livro_id, estudante_id, bibliotecario_id, data_emprestimo, data_devolucao))

        cursor.execute("""
            UPDATE livros
            SET quantidade_disponivel = quantidade_disponivel - 1,
                quantidade_indisponivel = quantidade_indisponivel + 1
            WHERE livro_id = ?
        """, (livro_id,))

        conn.commit()

        return True, 'Empréstimo registrado com sucesso.'
    else:
        return False, 'Não há livros disponíveis para emprestar.'


def obter_dados_atuais(cursor):
    cursor.execute("SELECT livro_id, titulo FROM livros WHERE quantidade_disponivel > 0")
    livros_disponiveis = cursor.fetchall()

    cursor.execute("SELECT estudante_id, nome FROM estudantes")
    estudantes = cursor.fetchall()

    cursor.execute("""
        SELECT b.estudante_id AS bibliotecario_id, e.nome 
        FROM bibliotecarios b
        JOIN estudantes e ON b.estudante_id = e.estudante_id
    """)
    bibliotecarios = cursor.fetchall()

    return livros_disponiveis, estudantes, bibliotecarios
from db import get_db_connection

# Função para atualizar os dados do livro
def update_livro(livro_id, data):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE livros SET
                titulo = ?,
                autor = ?,
                genero = ?,
                ano_de_publicacao = ?,
                isbn = ?,
                status = ?,
                quantidade_total = ?,
                quantidade_disponivel = ?,
                quantidade_indisponivel = ?
            WHERE livro_id = ?
        ''', (
            data['titulo'],
            data['autor'],
            data['genero'],
            data['ano_de_publicacao'],
            data['isbn'],
            data['status'],
            data['quantidade_total'],
            data['quantidade_disponivel'],
            data['quantidade_indisponivel'],
            livro_id
        ))
        conn.commit()

# Função para obter o livro pelo ID
def get_livro_by_id(livro_id):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM livros WHERE livro_id = ?', (livro_id,))
        livro = cursor.fetchone()
        return livro
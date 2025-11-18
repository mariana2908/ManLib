import sqlite3

# Função para conexão com o banco de dados
def get_db_connection():
    conn = sqlite3.connect('manlib.db')
    conn.row_factory = sqlite3.Row
    return conn

# Função para atualizar os dados do livro
def update_livro(livro_id, data):
    conn = get_db_connection()
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
    conn.close()

# Função para obter o livro pelo ID
def get_livro_by_id(livro_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM livros WHERE livro_id = ?', (livro_id,))
    livro = cursor.fetchone()  # Pega o primeiro resultado
    conn.close()
    return livro
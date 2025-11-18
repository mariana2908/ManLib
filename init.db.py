import sqlite3
import os

def init_db():
    # Verifica se o arquivo do banco de dados já existe
    db_exists = os.path.exists('manlib.db')
    
    # Conecta ao banco de dados (cria se não existir)
    conn = sqlite3.connect('manlib.db')
    cursor = conn.cursor()
    
    # Cria as tabelas se não existirem
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS estudantes (
        estudante_id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        matricula TEXT UNIQUE NOT NULL,
        turma TEXT,
        turno TEXT,
        telefone TEXT,
        status TEXT DEFAULT 'ativo',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bibliotecarios (
        estudante_id INTEGER PRIMARY KEY,
        status_bibliotecario TEXT DEFAULT 'ativo',
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (estudante_id) REFERENCES estudantes (estudante_id)
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS livros (
        livro_id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL,
        genero TEXT,
        ano_de_publicacao INTEGER,
        isbn TEXT UNIQUE,
        status TEXT DEFAULT 'disponível',
        quantidade_total INTEGER DEFAULT 1,
        quantidade_disponivel INTEGER DEFAULT 1,
        quantidade_indisponivel INTEGER DEFAULT 0,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS emprestimos (
        emprestimo_id INTEGER PRIMARY KEY AUTOINCREMENT,
        livro_id INTEGER NOT NULL,
        estudante_id INTEGER NOT NULL,
        bibliotecario_id INTEGER,
        data_emprestimo DATE NOT NULL,
        data_devolucao DATE NOT NULL,
        data_retorno DATE,
        status TEXT DEFAULT 'ativo',
        FOREIGN KEY (livro_id) REFERENCES livros (livro_id),
        FOREIGN KEY (estudante_id) REFERENCES estudantes (estudante_id),
        FOREIGN KEY (bibliotecario_id) REFERENCES bibliotecarios (estudante_id)
    )
    ''')
    
    # Se o banco de dados não existia, adiciona um usuário administrador padrão
    if not db_exists:
        cursor.execute('''
        INSERT INTO estudantes (nome, email, senha_hash, matricula, turma, turno, telefone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('Administrador', 'admin@example.com', 'pbkdf2:sha256:260000$...', 'ADMIN001', 'ADMIN', 'MATUTINO', '(00) 00000-0000', 'ativo'))
        
        # Obtém o ID do estudante recém-inserido
        cursor.execute('SELECT last_insert_rowid()')
        estudante_id = cursor.fetchone()[0]
        
        # Torna o estudante um bibliotecário
        cursor.execute('''
        INSERT INTO bibliotecarios (estudante_id, status_bibliotecario)
        VALUES (?, ?)
        ''', (estudante_id, 'ativo'))
        
        print("Banco de dados inicializado com sucesso!")
        print("Um usuário administrador foi criado com as seguintes credenciais:")
        print("Email: admin@example.com")
        print("Senha: admin123")
        print("Por favor, altere a senha após o primeiro login.")
    
    # Salva as alterações
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()

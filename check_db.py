import sqlite3

def check_database():
    try:
        # Conecta ao banco de dados
        conn = sqlite3.connect('manlib.db')
        cursor = conn.cursor()
        
        # Lista todas as tabelas
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\n=== TABELAS NO BANCO DE DADOS ===")
        for table in tables:
            table_name = table[0]
            print(f"\nTabela: {table_name}")
            print("Colunas:")
            
            # Obtém as colunas da tabela
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = cursor.fetchall()
            for column in columns:
                print(f"  - {column[1]} ({column[2]})")
        
        # Verifica se existem usuários cadastrados
        cursor.execute("SELECT COUNT(*) FROM estudantes;")
        count = cursor.fetchone()[0]
        print(f"\nTotal de estudantes cadastrados: {count}")
        
        if count > 0:
            cursor.execute("SELECT email FROM estudantes LIMIT 5;")
            print("\nAlguns e-mails de estudantes cadastrados:")
            for email in cursor.fetchall():
                print(f"- {email[0]}")
        
        conn.close()
        
    except Exception as e:
        print(f"Erro ao verificar o banco de dados: {str(e)}")

if __name__ == "__main__":
    check_database()

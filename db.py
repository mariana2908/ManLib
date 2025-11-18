from sqlite3 import connect, Row


DB_PATH = "manlib.db"


def get_db_connection():
    conn = connect(DB_PATH, check_same_thread=False, timeout=10)
    conn.row_factory = Row
    return conn
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from db import get_db_connection
import schedule
import time
from datetime import datetime

SENDER_EMAIL = os.environ.get('MANLIB_SENDER_EMAIL', 'manlib.emailautomatico@gmail.com')
SENDER_PASSWORD = os.environ.get('MANLIB_SENDER_PASSWORD', 'tnop lkoy lgjo wygx')
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587


def send_email(to_email, subject, body):
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server.send_message(msg)
        server.quit()

        with open("email_logs.txt", "a") as log_file:
            log_file.write(f"Sucesso: E-mail enviado para {to_email} com assunto '{subject}'\n")

        print(f"E-mail enviado para {to_email}")
    except Exception as e:
        with open("email_logs.txt", "a") as log_file:
            log_file.write(f"Erro: Não foi possível enviar o e-mail para {to_email}. Erro: {e}\n")
        print(f"Erro ao enviar e-mail: {e}")


def get_upcoming_returns():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            query = '''
            SELECT 
                e.email AS estudante_email,
                l.titulo AS livro_titulo,
                em.data_devolucao
            FROM emprestimos em
            JOIN estudantes e ON em.estudante_id = e.estudante_id
            JOIN livros l ON em.livro_id = l.livro_id
            WHERE (
                (date(em.data_devolucao) BETWEEN date('now') AND date('now', '+2 days'))
                OR date(em.data_devolucao) < date('now')
            )
            AND (em.status = 'ativo' OR em.status = 'atrasado')
            '''
            cursor.execute(query)
            results = cursor.fetchall()
            return results
    except Exception as e:
        print(f"Erro ao acessar banco de dados: {e}")
        return []


def send_reminders():
    data_atual = datetime.now().date()
    upcoming_returns = get_upcoming_returns()
    for email, book_title, due_date in upcoming_returns:
        try:
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        except Exception:
            # pula entradas com data inválida
            continue

        if due_date < data_atual:
            body = f"""
            Olá,

            A devolução do livro \"{book_title}\" está ATRASADA!
            Por favor, regularize a devolução o mais rápido possível!

            Obrigado!
            Equipe ManLib
            """
            subject = "Aviso de Livro Atrasado"
        else:
            body = f"""
            Olá,

            O livro '{book_title}' deve ser devolvido até {due_date}.
            Por favor, devolva o livro na data correta.

            Obrigado!
            Equipe ManLib
            """
            subject = "Lembrete de Devolução"

        try:
            send_email(email, subject, body)
            with open("email_logs.txt", "a") as log_file:
                log_file.write(f"Lembrete enviado para {email} sobre o livro '{book_title}' com data de devolução {due_date}\n")
        except Exception as e:
            with open("email_logs.txt", "a") as log_file:
                log_file.write(f"Erro ao enviar lembrete para {email} sobre o livro '{book_title}'. Erro: {e}\n")


def job():
    print("Executando tarefa agendada!")
    send_reminders()


def run_scheduler():
    # Agenda a função para rodar todos os dias às 09:00
    schedule.clear()
    schedule.every().day.at("09:00").do(job)

    # Loop para manter o agendador em execução; espera maior para diminuir disputa pelo DB
    while True:
        schedule.run_pending()
        time.sleep(30)
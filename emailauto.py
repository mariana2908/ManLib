import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import schedule
import time
from datetime import datetime

def send_email(to_email, subject, body):
    sender_email = "manlib.emailautomatico@gmail.com"
    sender_password = "tnop lkoy lgjo wygx"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    try:
        # Conexão com o servidor SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)

        # Configurando o e-mail
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        # Enviando o e-mail
        server.send_message(msg)
        server.quit()

        # Log de envio bem-sucedido
        with open("email_logs.txt", "a") as log_file:
            log_file.write(f"Sucesso: E-mail enviado para {to_email} com assunto '{subject}'\n")

        print(f"E-mail enviado para {to_email}")
    except Exception as e:
        # Log de erro
        with open("email_logs.txt", "a") as log_file:
            log_file.write(f"Erro: Não foi possível enviar o e-mail para {to_email}. Erro: {e}\n")

        print(f"Erro ao enviar e-mail: {e}")

def get_upcoming_returns():
    try:
        conn = sqlite3.connect('manlib.db')
        cursor = conn.cursor()

        # Busque empréstimos com data de devolução dentro de 2 dias
        query = """
        SELECT 
            e.email AS estudante_email,
            l.titulo AS livro_titulo,
            em.data_devolucao
        FROM emprestimos em
        JOIN estudantes e ON em.estudante_id = e.estudante_id
        JOIN livros l ON em.livro_id = l.livro_id
        WHERE 
            (em.data_devolucao BETWEEN DATE('now') AND DATE('now', '+2 days')
            OR em.data_devolucao < DATE('now'))
            AND em.status = 'ativo' OR em.status = 'atrasado'
        """
        cursor.execute(query)
        results = cursor.fetchall()
        conn.close()
        return results
    except Exception as e:
        print(f"Erro ao acessar banco de dados: {e}")
        return []

def send_reminders():
    data_atual = datetime.now().date()
    upcoming_returns = get_upcoming_returns()
    for email, book_title, due_date in upcoming_returns:
        due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        if due_date < data_atual:
            body = f"""
            Olá,

            A devolução do livro "{book_title}" está ATRASADA!
            Por favor, regularize a devolução o mais rápido possível!

            Obrigado!
            Equipe ManLib 2024
            """
            subject = "Aviso de Livro Atrasado"
        else:
            body = f"""
            Olá,

            O livro '{book_title}' deve ser devolvido até {due_date}.
            Por favor, devolva o livro na data correta.

            Obrigado!
            Equipe ManLib 2024
            """ 
            subject = "Lembrete de Devolução"
        try:
            send_email(email, subject, body)

            # Log de e-mail enviado
            with open("email_logs.txt", "a") as log_file:
                log_file.write(f"Lembrete enviado para {email} sobre o livro '{book_title}' com data de devolução {due_date}\n")
        except Exception as e:
            # Log de erro ao enviar e-mail
            with open("email_logs.txt", "a") as log_file:
                log_file.write(f"Erro ao enviar lembrete para {email} sobre o livro '{book_title}'. Erro: {e}\n")

def job():
    print("Executando tarefa agendada!")
    send_reminders()

def run_scheduler():
    # Agenda a função para rodar todos os dias às 09:00
    schedule.every().day.at("09:00").do(job)

    # Loop para manter o agendador em execução
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    try:
        run_scheduler()  # Executa o agendador em loop
    except KeyboardInterrupt:
        print("Execução interrompida manualmente.")

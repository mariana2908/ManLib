# Imagem base oficial do Python
FROM python:3.10-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos locais para dentro do container
COPY . .

RUN pip install --upgrade pip

RUN apt-get update && apt-get install -y libpq-dev

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Expondo a porta padrão do Flask (pode ser ajustado para 5000)
EXPOSE 5000

# Variáveis de ambiente padrão (coloque a SECRET_KEY no Railway)
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Comando para rodar o servidor com Gunicorn (recomendado para produção)
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]

FROM python:3.12-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para psycopg2 y pillow (si se usara)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Asegurar que la carpeta de uploads exista
RUN mkdir -p /app/static/uploads

# Exponer el puerto
EXPOSE 5000

# Ejecutar la semilla al iniciar, luego arrancar con Gunicorn para producción
CMD ["sh", "-c", "python semilla.py && python app.py"]
# Usa una imagen base oficial de Python 3.11 en su versión slim
FROM python:3.11-slim

# Evita que Python genere archivos .pyc y almacene la salida de forma no bufferizada
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED=1

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo el archivo de dependencias para aprovechar el caché de Docker
COPY requirements.txt .

# Instala las dependencias sin caché para reducir el tamaño de la imagen
RUN pip install --no-cache-dir -r requirements.txt

# Copia todo el contenido del directorio local
COPY . .

# Establece el directorio de trabajo en la carpeta del backend
# Esto hace que el comando Gunicorn sea más robusto
WORKDIR /app/backend

# Expone el puerto que la aplicación escuchará
EXPOSE 8000

# Comando para iniciar la aplicación con Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:application"]
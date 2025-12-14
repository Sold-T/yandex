FROM python:3.11-slim

WORKDIR /app

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование проекта
COPY . .

# Сборка статики
RUN python manage.py collectstatic --noinput

# Создание пользователя для безопасности
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# Запуск приложения
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "your_project.wsgi:application"]
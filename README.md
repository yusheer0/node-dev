# Yusheero Blog

Блог-платформа с использованием NestJS (backend) и Next.js (frontend).

## Запуск с помощью Docker

### Предварительные требования

Убедитесь, что у вас установлен Docker и Docker Compose.

### Запуск проекта

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd yusheero-blog
```

2. Запустите все сервисы:
```bash
docker-compose up --build
```

Или в фоновом режиме:
```bash
docker-compose up --build -d
```

3. Доступ к приложениям:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - PostgreSQL: localhost:5432

### Остановка сервисов

```bash
docker-compose down
```

### Остановка сервисов с удалением volumes

```bash
docker-compose down -v
```

## Архитектура

Проект состоит из трех основных сервисов:

- **postgres**: База данных PostgreSQL
- **backend**: API сервер на NestJS с TypeORM
- **frontend**: Веб-приложение на Next.js

## Переменные окружения

### Backend
- `NODE_ENV`: окружение (development/production)
- `DB_HOST`: хост базы данных
- `DB_PORT`: порт базы данных
- `DB_USERNAME`: имя пользователя БД
- `DB_PASSWORD`: пароль пользователя БД
- `DB_NAME`: имя базы данных

### Frontend
- `NEXT_PUBLIC_API_URL`: URL backend API

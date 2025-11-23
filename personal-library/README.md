# Личная библиотека книг

Веб-приложение для учета личной коллекции книг, разработанное на Next.js.

## Функционал

- ✅ Просмотр списка всех книг
- ✅ Добавление новых книг
- ✅ Редактирование информации о книгах
- ✅ Удаление книг
- ✅ Отметка книг как прочитанных/непрочитанных

## Технологии

- Next.js 16
- React 19
- SCSS для стилизации
- JavaScript (ES6+)

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Если возникла ошибка `ENOENT: no such file or directory`, выполните очистку кэша:
```bash
# Удалите папку .next вручную или используйте:
npm run clean
# Затем снова установите зависимости:
npm install
```

3. Убедитесь, что Django API сервер запущен на `http://localhost:8000`

4. (Опционально) Создайте файл `.env.local` для настройки URL API:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

5. Запустите dev сервер:
```bash
npm run dev
```

6. Откройте [http://localhost:3000](http://localhost:3000) в браузере

**Примечание:** Если у вас кириллица в пути к проекту (как в `Учебные проекты`), Turbopack может вызывать ошибки. Скрипт `dev` автоматически отключает Turbopack. Если хотите использовать Turbopack, используйте `npm run dev:turbo` (но убедитесь, что путь к проекту не содержит кириллицу).

## Решение проблем

### Ошибка ENOENT при запуске

Если вы видите ошибку `ENOENT: no such file or directory, open '.next/dev/server/app/page/build-manifest.json'`:

1. Удалите папку `.next`:
   ```bash
   # Windows (PowerShell)
   Remove-Item -Recurse -Force .next
   
   # Или вручную через проводник
   ```

2. Убедитесь, что все зависимости установлены:
   ```bash
   npm install
   ```

3. Запустите снова:
   ```bash
   npm run dev
   ```

## Структура проекта

```
src/
├── app/              # Next.js App Router
│   ├── layout.js     # Корневой layout
│   ├── page.js       # Главная страница
│   └── globals.scss  # Глобальные стили
├── components/       # React компоненты
│   ├── BookCard/     # Карточка книги
│   ├── BookForm/     # Форма добавления/редактирования
│   └── BookList/     # Список книг
└── lib/              # Утилиты
    └── api.js        # API клиент для работы с Django backend
```

## API Endpoints

Приложение использует следующие endpoints Django REST Framework:

- `GET /api/books/` - получить список всех книг
- `GET /api/books/{id}/` - получить книгу по ID
- `POST /api/books/` - создать новую книгу
- `PATCH /api/books/{id}/` - обновить книгу
- `DELETE /api/books/{id}/` - удалить книгу
- `POST /api/books/{id}/mark_as_read/` - отметить как прочитанную
- `POST /api/books/{id}/mark_as_unread/` - отметить как непрочитанную

## Примечание

Убедитесь, что Django API сервер настроен для работы с CORS, если frontend и backend работают на разных портах. Для этого может потребоваться установить и настроить `django-cors-headers`.

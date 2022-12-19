# Запуск

## Запуск Frontend

```shell
cd frontend
npm install
ng serve
```

## Запуск Backend

В корневой папке должен находится файл .env с переменными
окружения [Скачать](https://drive.google.com/u/0/uc?id=1IBwtbkCgHzMYeeFAwOST3QOeyXcn9GSL&export=download)

Для тестирования отправки писем зарегистрироваться на [mailtrap.io](https://mailtrap.io/) и вставить в .env собственные
EMAIL_HOST_USER и EMAIL_HOST_PASSWORD (либо оставить имеющиеся, но письма будут приходить в
ящик [@angstorm](https://github.com/angst-storm))

### Запуск в Windows:

Установить postgres и создать базу данных. Имя базы данных, имя пользователя и пароль вставить в .env в поля POSTGRES_DB_NAME,
POSTGRES_USER, POSTGRES_PASSWORD.

```shell
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Запуск с помощью Docker:

Установить и запустить Docker.

```shell
docker-compose up -d
```

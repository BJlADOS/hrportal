# Запуск

## Запуск Frontend

```shell
cd frontend
npm install
ng serve
```

## Запуск Backend

В корневой папке должен находится файл .env с переменными окружения (с секретными
ключами) [Скачать](https://drive.google.com/u/0/uc?id=1IBwtbkCgHzMYeeFAwOST3QOeyXcn9GSL&export=download)

Для тестирования отправки писем зарегистрироваться на [mailtrap.io](https://mailtrap.io/) и вставить в .env собственные
EMAIL_HOST_USER и EMAIL_HOST_PASSWORD (либо оставить имеющиеся, но письма будут приходить в
ящик [@angstorm](https://github.com/angst-storm))

```shell
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

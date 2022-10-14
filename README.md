# Запуск

## Запуск Frontend

```shell
cd frontend
npm install
ng serve
```

## Запуск Backend

В корневой папке должен находится файл .env с переменными окружения (с секретным
ключом) [Скачать](https://drive.google.com/u/0/uc?id=1IBwtbkCgHzMYeeFAwOST3QOeyXcn9GSL&export=download)

```shell
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

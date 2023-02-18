## Запуск Frontend

Требуется:

- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [@angular/cli](https://angular.io/cli)

```shell
cd frontend
npm install
ng serve
```

Приложение разворачивается на http://localhost:4200

## Запуск Backend

### Запуск в Windows:

Требуется:

- [python](https://www.python.org/downloads/)
- [pip](https://pypi.org/project/pip/)
- [postgresql](https://www.postgresql.org/download/)

В корневой папке должен находится файл .env с переменными
окружения [Скачать](https://drive.google.com/u/0/uc?id=1IBwtbkCgHzMYeeFAwOST3QOeyXcn9GSL&export=download)

Установить postgres и создать базу данных. Имя базы данных, имя пользователя и пароль вставить в .env в поля
POSTGRES_DB_NAME,
POSTGRES_USER, POSTGRES_PASSWORD.

```shell
cd backend
python -m venv venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Приложение разворачивается на http://localhost:8000

Для создания суперюзеров (для доступа к панели администратора Django):

```shell
python manage.py createsuperuser
```

### Запуск с помощью Docker:

Требуется:

- [docker](https://www.docker.com/get-started/)
- [docker compose](https://docs.docker.com/compose/install/)

В корневой папке должен находится файл .env.docker с переменными
окружения [Скачать](https://drive.google.com/u/0/uc?id=1IBwtbkCgHzMYeeFAwOST3QOeyXcn9GSL&export=download)

Для запуска только Backend в DEV режиме (на http://localhost:8000):

```shell
docker compose -f docker-compose-dev.yaml up -d
```

Также есть возможность добавить Frontend в DEV режиме (на http://localhost:4200):

```shell
docker compose -f docker-compose-dev.yaml --profile frontend up -d --build
```

Для запуска всего приложения (включая nginx) в PROD режиме (на http://localhost):

```shell
docker compose -f docker-compose-prod.yaml up -d --build
```

Аргумент `--build` необходимо использовать, если вы хотите быть уверены, что докер запустит контейнеры со всеми последними
изменениями в коде. Если не использовать аргумент `--build`, Docker будет использовать последние собранные контейнеры.
Также аргумент `--build` рекомендуется использовать в случае перехода с DEV на PROD версию Frontend, так как при сборке
его контейнера используются переменные окружения.

### Настройки отправки почты

Для тестирования отправки почты зарегистрироваться на [mailtrap.io](https://mailtrap.io/) и вставить в .env (.env.docker)
собственные
EMAIL_HOST_USER и EMAIL_HOST_PASSWORD (либо оставить имеющиеся, но письма будут приходить в
ящик [@angstorm](https://github.com/angst-storm))

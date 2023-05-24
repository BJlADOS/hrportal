FROM python:3

ENV PYTHONUNBUFFERED=1

COPY /backend/ /backend/
COPY /hr_api/ /hr_api/
COPY manage.py .
COPY requirements.txt .

RUN pip install -r /requirements.txt

ENTRYPOINT python manage.py collectstatic --noinput ; python manage.py migrate ; python manage.py runserver 0.0.0.0:$PORT
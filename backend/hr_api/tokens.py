import jwt
from django.conf import settings


def create_user_token(user):
    payload = {'id': user.id, 'fullname': user.fullname, 'email': user.email}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def get_token_user(token):
    from .models import User
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if 'id' in payload and 'fullname' in payload and 'email' in payload:
            return User.objects.get(**payload)
    except jwt.DecodeError or User.DoesNotExist:
        pass
    return None

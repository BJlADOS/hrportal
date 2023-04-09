import jwt
from django.conf import settings
from rest_framework import authentication, exceptions


def add_auth(request, user):
    request.session['Authorization'] = f'Bearer {create_user_token(user)}'


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


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Bearer'

    def authenticate(self, request):
        request.user = None

        token = self.extract_token(request, self.authentication_header_prefix)

        if token is None:
            return None

        return self.authenticate_credentials(token)

    @staticmethod
    def extract_token(request, expected_prefix):
        auth_header = request.session.get('Authorization', '').split()

        if len(auth_header) != 2:
            return None

        prefix = auth_header[0]
        token = auth_header[1]

        if prefix.lower() != expected_prefix.lower():
            return None

        return token

    @staticmethod
    def authenticate_credentials(token):
        user = get_token_user(token)

        if user is None:
            raise exceptions.AuthenticationFailed('Invalid authentication. Could not decode token.')

        return user, token

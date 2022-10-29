import jwt
from django.conf import settings
from jwt import DecodeError
from rest_framework import authentication, exceptions

from .models import User


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
        auth_header = request.COOKIES.get('Authorization', '').split()

        if len(auth_header) != 2:
            return None

        prefix = auth_header[0]
        token = auth_header[1]

        if prefix.lower() != expected_prefix.lower():
            return None

        return token

    @staticmethod
    def authenticate_credentials(token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except DecodeError:
            raise exceptions.AuthenticationFailed('Invalid authentication. Could not decode token.')

        user = User.objects.get(email=payload['email'])

        return user, token

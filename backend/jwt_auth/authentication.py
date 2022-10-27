import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from .models import User


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Bearer'

    def authenticate(self, request):
        request.user = None

        auth_header = authentication.get_authorization_header(request).split()

        if not auth_header or len(auth_header) == 1 or len(auth_header) > 2:
            return None

        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != self.authentication_header_prefix.lower():
            return None

        return self._authenticate_credentials(token)

    @staticmethod
    def _authenticate_credentials(token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except:
            raise exceptions.AuthenticationFailed('Invalid authentication. Could not decode token.')

        user = User.objects.get(email=payload['email'])

        return user, token

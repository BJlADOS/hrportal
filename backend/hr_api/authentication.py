from rest_framework import authentication, exceptions

from .tokens import get_token_user


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

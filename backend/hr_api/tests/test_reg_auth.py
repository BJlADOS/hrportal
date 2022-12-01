import json

from django.test import TestCase, Client

from ..models import *


class UserData:
    def __init__(self, fullname, email, password):
        self.fullname = fullname
        self.email = email
        self.password = password


class RegAndAuthTests(TestCase):
    user_data = UserData('user', 'user@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(**cls.user_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_RegistrationView_ShouldRegistrateUser(self):
        reg_data = {'fullname': 'newuser', 'email': 'newuser@hrportal.com', 'password': 'password'}

        response = self.client.post('/reg/', reg_data)

        self.assertEqual(response.status_code, 201)

    def test_RegistrationView_ShouldRaiseValidationError_OnNonUniqueEmail(self):
        reg_data = {'fullname': 'newuser', 'email': self.user_data.email, 'password': 'password'}

        response = self.client.post('/reg/', reg_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'user with this email already exists.')

    def test_RegistrationView_ShouldRaiseValidationError_OnIncompleteData(self):
        reg_data = {}

        response = self.client.post('/reg/', reg_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['fullname'][0], 'This field is required.')
        self.assertEqual(errors['email'][0], 'This field is required.')
        self.assertEqual(errors['password'][0], 'This field is required.')

    def test_RegistrationView_ShouldRaiseValidationError_OnInvalidEmail(self):
        reg_data = {'email': 'no email'}

        response = self.client.post('/reg/', reg_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'Enter a valid email address.')

    def test_UniqueEmailView_ShouldReturnTrue_OnUniqueEmail(self):
        request_data = {'email': 'unique@hrportal.com'}

        response = self.client.post('/unique-email/', request_data)

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['unique']
        self.assertTrue(authorized)

    def test_UniqueEmailView_ShouldReturnFalse_OnNonUniqueEmail(self):
        request_data = {'email': self.user_data.email}

        response = self.client.post('/unique-email/', request_data)

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['unique']
        self.assertFalse(authorized)

    def test_UniqueEmailView_ShouldRaiseValidationError_OnIncompleteData(self):
        request_data = {'email': 'not email'}

        response = self.client.post('/unique-email/', request_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'Enter a valid email address.')

    def test_UniqueEmailView_ShouldRaiseValidationError_OnInvalidEmail(self):
        request_data = {}

        response = self.client.post('/unique-email/', request_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'This field is required.')

    def test_LoginView_ShouldLoginUser(self):
        response = self.login_user()

        self.assertEqual(response.status_code, 200)

        self.assertTrue(self.client_is_login())

    def test_LoginView_ShouldRaise401_OnWrongPassword(self):
        login_data = {'email': self.user_data.email, 'password': self.user_data.password + 'error'}

        response = self.client.post('/login/', login_data)

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'A user with this email and password was not found.')

    def test_LoginView_ShouldRaise401_OnWrongEmail(self):
        login_data = {'email': 'error' + self.user_data.email, 'password': self.user_data.password}

        response = self.client.post('/login/', login_data)

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'A user with this email and password was not found.')

    def test_LoginView_ShouldRaiseValidationError_OnIncompleteData(self):
        login_data = {}

        response = self.client.post('/login/', login_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'This field is required.')
        self.assertEqual(errors['password'][0], 'This field is required.')

    def test_LogoutView_ShouldLogoutUser(self):
        self.login_user()

        response = self.client.get('/logout/')

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.client_is_login())

    def test_LogoutView_DontRaiseException_OnUnauthorizedClient(self):
        self.client.session.delete()

        response = self.client.get('/logout/')

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.client_is_login())

    def test_AuthorizedView_ShouldReturnTrue_OnAuthorizedClient(self):
        self.login_user()

        response = self.client.get('/authorized/')

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['authorized']
        self.assertTrue(authorized)

    def test_AuthorizedView_ShouldReturnFalse_OnUnauthorizedClient(self):
        response = self.client.get('/authorized/')

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['authorized']
        self.assertFalse(authorized)

    def client_is_login(self):
        return self.client.session.session_key is not None

    def login_user(self):
        login_data = {'email': self.user_data.email, 'password': self.user_data.password}
        return self.client.post('/login/', login_data)

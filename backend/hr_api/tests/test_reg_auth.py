import json

from django.conf import settings
from django.core import mail
from django.test import TestCase, Client

from ..authentication import create_user_token
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
        email_subject = 'Подтверждение адреса электронной почты на HR-портале "Очень Интересно"'
        emails_count_before = len(mail.outbox)

        response = self.client.post('/api/reg/', reg_data)

        self.assertEqual(response.status_code, 201)
        detail = json.loads(*response)['detail']
        user = User.objects.get(email=reg_data['email'])
        self.assertEqual(detail[0], f'Email verification mail to User(ID={user.id}) sending successful')
        self.assertEqual(emails_count_before, len(mail.outbox) - 1)
        emails = [m for m in mail.outbox if m.subject == email_subject]
        self.assertEqual(len(emails), 1)
        self.assertTrue(f'{settings.VERIFICATION_URL}?code={create_user_token(user)}' in str(emails[0].message()))

    def test_RegistrationView_ShouldRaiseValidationError_OnNonUniqueEmail(self):
        reg_data = {'fullname': 'newuser', 'email': self.user_data.email, 'password': 'password'}

        response = self.client.post('/api/reg/', reg_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'user with this email already exists.')

    def test_RegistrationView_ShouldRaiseValidationError_OnBlankData(self):
        response = self.client.post('/api/reg/', {})

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['fullname'][0], 'This field is required.')
        self.assertEqual(errors['email'][0], 'This field is required.')
        self.assertEqual(errors['password'][0], 'This field is required.')

    def test_RegistrationView_ShouldRaiseValidationError_OnInvalidEmail(self):
        reg_data = {'email': 'no email'}

        response = self.client.post('/api/reg/', reg_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'Enter a valid email address.')

    def test_UniqueEmailView_ShouldReturnTrue_OnUniqueEmail(self):
        request_data = {'email': 'unique@hrportal.com'}

        response = self.client.post('/api/unique-email/', request_data)

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['unique']
        self.assertTrue(authorized)

    def test_UniqueEmailView_ShouldReturnFalse_OnNonUniqueEmail(self):
        request_data = {'email': self.user_data.email}

        response = self.client.post('/api/unique-email/', request_data)

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['unique']
        self.assertFalse(authorized)

    def test_UniqueEmailView_ShouldRaiseValidationError_OnIncompleteData(self):
        request_data = {'email': 'not email'}

        response = self.client.post('/api/unique-email/', request_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'Enter a valid email address.')

    def test_UniqueEmailView_ShouldRaiseValidationError_OnInvalidEmail(self):
        request_data = {}

        response = self.client.post('/api/unique-email/', request_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'This field is required.')

    def test_LoginView_ShouldLoginUser(self):
        response = self.login_user()

        self.assertEqual(response.status_code, 200)

        self.assertTrue(self.client_is_login())

    def test_LoginView_ShouldRaise401_OnWrongPassword(self):
        login_data = {'email': self.user_data.email, 'password': self.user_data.password + 'error'}

        response = self.client.post('/api/login/', login_data)

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, ['A user with this email and password was not found.'])

    def test_LoginView_ShouldRaise401_OnWrongEmail(self):
        login_data = {'email': 'error' + self.user_data.email, 'password': self.user_data.password}

        response = self.client.post('/api/login/', login_data)

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, ['A user with this email and password was not found.'])

    def test_LoginView_ShouldRaiseValidationError_OnIncompleteData(self):
        login_data = {}

        response = self.client.post('/api/login/', login_data)

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'This field is required.')
        self.assertEqual(errors['password'][0], 'This field is required.')

    def test_LogoutView_ShouldLogoutUser(self):
        self.login_user()

        response = self.client.get('/api/logout/')

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.client_is_login())

    def test_LogoutView_DontRaiseException_OnUnauthorizedClient(self):
        self.client.session.delete()

        response = self.client.get('/api/logout/')

        self.assertEqual(response.status_code, 200)
        self.assertFalse(self.client_is_login())

    def test_AuthorizedView_ShouldReturnTrue_OnAuthorizedClient(self):
        self.login_user()

        response = self.client.get('/api/authenticated/')

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['authenticated']
        self.assertTrue(authorized)

    def test_AuthorizedView_ShouldReturnFalse_OnUnauthorizedClient(self):
        response = self.client.get('/api/authenticated/')

        self.assertEqual(response.status_code, 200)
        authorized = json.loads(*response)['authenticated']
        self.assertFalse(authorized)

    def test_VerificationView_ShouldRaiseValidationError_OnBlankData(self):
        response = self.client.post('/api/verify-email/', {})

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['code'][0], 'This field is required.')

    def test_VerificationView_ShouldRaise401_OnInvalidCode(self):
        response = self.client.post('/api/verify-email/', {'code': 'code'})

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail[0], 'Invalid verification code.')

    def test_VerificationView_ShouldConfirmUserEmail(self):
        user = User.objects.first()
        self.assertFalse(user.email_verified)

        response = self.client.post('/api/verify-email/', {'code': create_user_token(user)})

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.email_verified)

    def test_RecoveryRequestView_ShouldRaiseValidationError_OnBlankData(self):
        response = self.client.post('/api/change-password/', {})

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'This field is required.')

    def test_RecoveryRequestView_ShouldRaiseValidationError_OnInvalidEmail(self):
        response = self.client.post('/api/change-password/', {'email': 'no email'})

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['email'][0], 'Enter a valid email address.')

    def test_RecoveryRequestView_ShouldDontSendRecoveryEmail_OnNonExistentEmail(self):
        emails_count_before = len(mail.outbox)

        response = self.client.post('/api/change-password/', {'email': 'error' + self.user_data.email})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(emails_count_before, len(mail.outbox))

    def test_RecoveryRequestView_ShouldSendRecoveryEmail(self):
        email_subject = 'Смена (восстановление) пароля на HR-портале "Очень Интересно"'
        emails_count_before = len(mail.outbox)
        user = User.objects.get(email=self.user_data.email)

        response = self.client.post('/api/change-password/', {'email': user.email})

        emails = [m for m in mail.outbox if m.subject == email_subject]
        self.assertEqual(emails_count_before, len(mail.outbox) - 1)
        self.assertEqual(len(emails), 1)
        self.assertTrue(f'{settings.SET_PASSWORD_URL}?code={create_user_token(user)}' in str(emails[0].message()))
        self.assertEqual(response.status_code, 200)

    def test_RecoveryView_ShouldRaiseValidationError_OnBlankData(self):
        response = self.client.post('/api/set-password/', {})

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['code'][0], 'This field is required.')
        self.assertEqual(errors['password'][0], 'This field is required.')

    def test_RecoveryView_ShouldRaise401_OnInvalidCode(self):
        data = {'code': 'code', 'password': 'password'}

        response = self.client.post('/api/set-password/', data)

        self.assertEqual(response.status_code, 401)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail[0], 'Invalid verification code.')

    def test_RecoveryView_ShouldChangePassword(self):
        user = User.objects.get(email=self.user_data.email)
        new_password = 'newpassword'
        self.assertNotEqual(self.user_data.password, new_password)
        password_before = user.password
        data = {'code': create_user_token(user), 'password': new_password}

        response = self.client.post('/api/set-password/', data)

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertNotEqual(password_before, user.password)
        self.user_data.password = new_password

    def client_is_login(self):
        return self.client.session.session_key is not None

    def login_user(self):
        login_data = {'email': self.user_data.email, 'password': self.user_data.password}
        return self.client.post('/api/login/', login_data)

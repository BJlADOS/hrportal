import json

from django.test import TestCase, Client

from .test_reg_auth import UserData
from ..serializers import *


class ProfileTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(**cls.employee_data.__dict__)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        Department.objects.create(name="department", manager=manager).save()

    def setUp(self):
        self.client = Client()

    def test_GetUser_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get('/user/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetUser_ShouldGetUserInfo(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get('/user/')

        self.assertEqual(response.status_code, 200)

    def test_GetUser_IsManagerFieldIsFalse_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get('/user/')

        self.assertEqual(response.status_code, 200)
        is_manager = json.loads(*response)['isManager']
        self.assertFalse(is_manager)

    def test_GetUser_IsManagerFieldIsTrue_OnManager(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get('/user/')

        self.assertEqual(response.status_code, 200)
        is_manager = json.loads(*response)['isManager']
        self.assertTrue(is_manager)

    def test_PatchUser_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch('/user/', {})

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PatchUser_ShouldDontRaiseException_OnBlankData(self):
        self.login_user(self.client, self.employee_data)
        user_before = GetUserSerializer(User.objects.get(email=self.employee_data.email)).data

        response = self.client.patch('/user/')

        self.assertEqual(response.status_code, 200)
        user_after = GetUserSerializer(User.objects.get(email=self.employee_data.email)).data
        self.assertEqual(user_before, user_after)

    def test_PatchUser_ShouldChangeUser(self):
        self.login_user(self.client, self.employee_data)
        user_before = GetUserSerializer(User.objects.get(email=self.employee_data.email)).data

        response = self.client.patch('/user/', {'contact': 'contact'}, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        user_after = GetUserSerializer(User.objects.get(email=self.employee_data.email)).data
        self.assertNotEqual(user_before, user_after)
        user_before['contact'] = 'contact'
        self.assertEqual(user_before, user_after)

    def test_GetUsers_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch('/users/', {})

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetUsers_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.patch('/users/', {})

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetUsers_ShouldGetUsersInfo(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get('/users/')

        self.assertEqual(response.status_code, 200)

    def test_GetUserByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(f'/users/{self.get_existing_user_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetUserByPk_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get(f'/users/{self.get_existing_user_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetUserByPk_ShouldRaise404_OnNonExistentUserId(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get(f'/users/{self.get_nonexistent_user_id()}/')

        self.assertEqual(response.status_code, 404)

    def test_GetUserByPk_ShouldReturnUserInfo(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get(f'/users/{self.get_existing_user_id()}/')

        self.assertEqual(response.status_code, 200)

    @staticmethod
    def get_existing_user_id():
        return User.objects.all().first().id

    @staticmethod
    def get_nonexistent_user_id():
        return User.objects.all().last().id + 1

    @staticmethod
    def login_user(client, user_data):
        login_data = {'email': user_data.email, 'password': user_data.password}
        client.post('/login/', login_data)

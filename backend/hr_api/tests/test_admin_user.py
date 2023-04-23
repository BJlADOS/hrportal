import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..models import User


def get_non_existent_user_id() -> int:
    return sum([user.id for user in User.objects.all()])


class ResumeArchivingTests(TestCase):
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    inactive_user_data = UserData('inactive_user', 'inactive_user@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        create_department(manager)
        inactive_user = User.objects.create_user(**cls.inactive_user_data.__dict__)
        inactive_user.deactivate()
        User.objects.create_superuser(**cls.admin_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_onlyActiveUsers_availableForManager(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse('user-list'))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        self.assertNotEquals(len(result), 0)
        for r in result:
            _id = r['id']
            user = User.objects.get(id=_id)
            self.assertDictEqual(r, get_user_serialized_dict(user))
            self.assertTrue(user.is_active)

    def test_inactiveUsers_notAvailableForManager(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse('user-list') + '?active=false')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), 0)

    def test_inactiveUsers_availableForAdmin(self):
        login_user(self.client, self.admin_data)

        response = self.client.get(reverse('user-list') + '?active=false')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f'result body - {result}')
        self.assertNotEquals(len(result), 0)
        for r in result:
            _id = r['id']
            user = User.objects.get(id=_id)
            self.assertDictEqual(r, get_user_serialized_dict(user))
            self.assertFalse(user.is_active)

    def test_allUsers_availableForAdmin(self):
        login_user(self.client, self.admin_data)

        response = self.client.get(reverse('user-list'))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(result), len(User.objects.all()))
        for r in result:
            _id = r['id']
            user = User.objects.get(id=_id)
            self.assertDictEqual(r, get_user_serialized_dict(user))

    def test_manager_cantSoftDeleteUser(self):
        login_user(self.client, self.manager_data)
        _id = User.objects.get(email=self.admin_data.email).id

        response = self.client.delete(reverse('user-detail', args=(_id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(result['detail'], 'You do not have permission to perform this action.')

    def test_manager_cantFinalDeleteUser(self):
        login_user(self.client, self.manager_data)
        _id = User.objects.get(email=self.admin_data.email).id

        response = self.client.delete(reverse('user-final-delete', args=(_id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 403)
        self.assertEqual(result['detail'], 'You do not have permission to perform this action.')

    def test_admin_canSoftDeleteUser(self):
        login_user(self.client, self.admin_data)
        user = User.objects.get(email=self.manager_data.email)
        self.assertTrue(user.is_active)
        _id = user.id

        response = self.client.delete(reverse('user-detail', args=(_id,)))

        self.assertEqual(response.status_code, 204)
        user.refresh_from_db()
        self.assertFalse(user.is_active)
        user.is_active = True
        user.save()

    def test_admin_canFinalDeleteUser(self):
        user_data = UserData('user', 'new_user@hrportal.com', 'password')
        _id = User.objects.create_user(**user_data.__dict__).id
        login_user(self.client, self.admin_data)

        response = self.client.delete(reverse('user-final-delete', args=(_id,)))

        self.assertEqual(response.status_code, 204)
        self.assertFalse(User.objects.filter(id=_id).exists())

    def test_admin_cantSoftDeleteNonExistingUser(self):
        _id = get_non_existent_user_id()
        login_user(self.client, self.admin_data)

        response = self.client.delete(reverse('user-detail', args=(_id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(result['detail'], 'Not found.')

    def test_admin_cantFinalDeleteNonExistingUser(self):
        _id = get_non_existent_user_id()
        login_user(self.client, self.admin_data)

        response = self.client.delete(reverse('user-final-delete', args=(_id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(result['detail'], 'Not found.')


import json

from django.test import TestCase, Client

from .test_reg_auth import UserData
from ..models import *


class SkillTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(**cls.employee_data.__dict__)
        User.objects.create_superuser(**cls.admin_data.__dict__)
        Skill.objects.create(name="skill").save()

    def setUp(self):
        self.client = Client()

    def test_GetSkills_ShouldRaise403_onUnauthorizedClient(self):
        response = self.client.get('/api/skills/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetSkills_ShouldGetSkillsInfo(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get('/api/skills/')

        self.assertEqual(response.status_code, 200)

    def test_PostSkills_ShouldRaise403_onUnauthorizedClient(self):
        response = self.client.post('/api/skills/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostSkills_ShouldRaise403_onEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post('/api/skills/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PostSkills_ShouldRaise403_onBlankData(self):
        self.login_user(self.client, self.admin_data)

        response = self.client.post('/api/skills/')

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['name'][0], 'This field is required.')

    def test_PostSkills_ShouldCreateSkill(self):
        self.login_user(self.client, self.admin_data)

        response = self.client.post('/api/skills/', {'name': 'test_PostSkills_ShouldCreateSkill'})

        self.assertEqual(response.status_code, 201)
        skill = Skill.objects.last()
        self.assertEqual(skill.name, 'test_PostSkills_ShouldCreateSkill')
        skill.delete()

    def test_GetSkillByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(f'/api/skills/{self.get_existing_skill_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetSkillByPk_ShouldRaise403_onEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post('/api/skills/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetSkillByPk_ShouldRaise404_onNonExistentSkill(self):
        self.login_user(self.client, self.admin_data)

        response = self.client.get(f'/api/skills/{self.get_nonexistent_skill_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_GetSkillByPk_ShouldGetSkillInfo(self):
        self.login_user(self.client, self.admin_data)

        response = self.client.get(f'/api/skills/{self.get_existing_skill_id()}/')

        self.assertEqual(response.status_code, 200)

    def test_DeleteSkillByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.delete(f'/api/skills/{self.get_existing_skill_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_DeleteSkillByPk_ShouldRaise403_onEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.delete(f'/api/skills/{self.get_existing_skill_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_DeleteSkillByPk_ShouldRaise404_onNonExistentSkill(self):
        self.login_user(self.client, self.admin_data)

        response = self.client.delete(f'/api/skills/{self.get_nonexistent_skill_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_DeleteSkillByPk_ShouldDeleteSkill(self):
        skill = Skill.objects.create(name='test_DeleteSkillByPk_ShouldDeleteSkill')
        skill.save()
        self.login_user(self.client, self.admin_data)

        response = self.client.delete(f'/api/skills/{skill.id}/')

        self.assertEqual(response.status_code, 204)
        try:
            skill = Skill.objects.get(id=skill.id)
        except Skill.DoesNotExist:
            skill = None
        self.assertIsNone(skill)

    @staticmethod
    def get_existing_skill_id():
        return Skill.objects.all().first().id

    @staticmethod
    def get_nonexistent_skill_id():
        return Skill.objects.all().last().id + 1

    @staticmethod
    def login_user(client, user_data):
        login_data = {'email': user_data.email, 'password': user_data.password}
        client.post('/api/login/', login_data)

import json

from django.test import TestCase, Client

from .test_reg_auth import UserData
from ..serializers import *


class VacancyTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    other_manager_data = UserData('manager', 'other-manager@hrportal.com', 'password')
    vacancy_data = {
        'position': 'position',
        'salary': 0,
        'employment': 'PART',
        'schedule': 'DISTANT',
        'description': 'description',
        'requiredSkillsIds': [1, 2, 3],
        'isActive': True
    }

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(**cls.employee_data.__dict__)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        department = Department.objects.create(name="department", manager=manager)
        department.save()
        vacancy = Vacancy.objects.create(department=department,
                                         position=cls.vacancy_data['position'],
                                         salary=cls.vacancy_data['salary'],
                                         employment=cls.vacancy_data['employment'],
                                         schedule=cls.vacancy_data['schedule'],
                                         description=cls.vacancy_data['description'],
                                         is_active=cls.vacancy_data['isActive'])
        for name in ["1", "2", "3"]:
            skill = Skill.objects.create(name=name)
            skill.save()
            vacancy.required_skills.add(skill)
        other_manager = User.objects.create_user(**cls.other_manager_data.__dict__)
        Department.objects.create(name="department", manager=other_manager).save()

    def setUp(self):
        self.client = Client()

    # TODO Тесты на проверку возвращаемой информации о вакансии

    def test_GetVacancies_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get('/vacancies/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    # TODO Тесты на валидацию передаваемых в Post и Patch значений и создание и изменение вакансии

    def test_PostVacancies_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post('/vacancies/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostVacancies_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post('/vacancies/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PostVacancies_ShouldRaiseValidationError_OnBlankData(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.post('/vacancies/', content_type='application/json')

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['position'][0], 'This field is required.')
        self.assertEqual(errors['salary'][0], 'This field is required.')
        self.assertEqual(errors['employment'][0], 'This field is required.')
        self.assertEqual(errors['schedule'][0], 'This field is required.')
        self.assertEqual(errors['description'][0], 'This field is required.')
        self.assertEqual(errors['requiredSkillsIds'][0], 'This field is required.')
        self.assertEqual(errors['isActive'][0], 'This field is required.')

    def test_PostVacancies_ShouldCreateVacancy(self):
        self.login_user(self.client, self.other_manager_data)
        department = User.objects.get(email=self.other_manager_data.email).department

        response = self.client.post('/vacancies/', self.vacancy_data)

        self.assertEqual(response.status_code, 201)
        vacancy = json.loads(*response)
        self.assertEqual(vacancy['department']['id'], department.id)
        department.vacancy_set.last().delete()

    def test_GetVacancies_ShouldGetVacanciesInfo(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get('/vacancies/')

        self.assertEqual(response.status_code, 200)

    def test_GetVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get(f'/vacancies/{self.get_nonexistent_vacancy_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_GetVacancyByPk_ShouldGetVacanciesInfo(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 200)

    def test_PatchVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PatchVacancyByPk_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PatchVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.patch(f'/vacancies/{self.get_nonexistent_vacancy_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_PatchVacancyByPk_ShouldRaise403_OnNotYoursVacancy(self):
        self.login_user(self.client, self.other_manager_data)

        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PatchVacancyByPk_ShouldChangeVacancy(self):
        self.login_user(self.client, self.manager_data)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_before = GetVacancySerializer(vacancy).data

        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/', {'isActive': False},
                                     content_type="application/json")

        self.assertEqual(response.status_code, 200)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_after = GetVacancySerializer(vacancy).data
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['modifiedAt'] = vacancy_after['modifiedAt']
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['isActive'] = vacancy_after['isActive']
        self.assertEqual(vacancy_before, vacancy_after)

    def test_DeleteVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.delete(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_DeleteVacancyByPk_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.delete(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_DeleteVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.delete(f'/vacancies/{self.get_nonexistent_vacancy_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_DeleteVacancyByPk_ShouldRaise403_OnNotYoursVacancy(self):
        self.login_user(self.client, self.other_manager_data)

        response = self.client.delete(f'/vacancies/{self.get_existing_vacancy_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_DeleteVacancyByPk_ShouldDeleteVacancy(self):
        department = User.objects.get(email=self.other_manager_data.email).department
        data = dict(self.vacancy_data)
        del data['isActive']
        del data['requiredSkillsIds']
        vacancy = Vacancy.objects.create(department=department, is_active=True, **data)
        vacancy.save()
        count_before = department.vacancy_set.count()
        self.login_user(self.client, self.other_manager_data)

        response = self.client.delete(f'/vacancies/{vacancy.id}/')

        self.assertEqual(response.status_code, 204)
        self.assertNotEqual(count_before, 0)
        self.assertEqual(department.vacancy_set.count(), 0)

    # TODO Тесты на работу отклика на вакансию

    @staticmethod
    def get_existing_vacancy_id():
        return Vacancy.objects.all().first().id

    @staticmethod
    def get_nonexistent_vacancy_id():
        return Vacancy.objects.all().last().id + 1

    @staticmethod
    def login_user(client, user_data):
        login_data = {'email': user_data.email, 'password': user_data.password}
        client.post('/login/', login_data)

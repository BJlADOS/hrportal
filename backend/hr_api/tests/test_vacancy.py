import json

from django.test import TestCase, Client

from django.core.files.uploadedfile import SimpleUploadedFile
from .test_reg_auth import UserData
from .test_resume import resume_data, create_resume_for
from ..serializers import *


class VacancyTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    other_manager_data = UserData('manager', 'other-manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')
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
        User.objects.create_superuser(**cls.admin_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_GetVacancies_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get('/vacancies/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

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

        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/',
                                     {'requiredSkillsIds': [1, 2]},
                                     content_type="application/json")

        self.assertEqual(response.status_code, 200)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_after = GetVacancySerializer(vacancy).data
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['modifiedAt'] = vacancy_after['modifiedAt']
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['requiredSkills'] = vacancy_after['requiredSkills']
        self.assertEqual(vacancy_before, vacancy_after)

    def test_PatchVacancyByPk_ShouldChangeVacancy_OnAdmin(self):
        self.login_user(self.client, self.admin_data)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_before = GetVacancySerializer(vacancy).data

        response = self.client.patch(f'/vacancies/{self.get_existing_vacancy_id()}/',
                                     {'requiredSkillsIds': [1]},
                                     content_type="application/json")

        self.assertEqual(response.status_code, 200)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_after = GetVacancySerializer(vacancy).data
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['modifiedAt'] = vacancy_after['modifiedAt']
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['requiredSkills'] = vacancy_after['requiredSkills']
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
        vacancy = self.create_vacancy_for(department)
        count_before = department.vacancy_set.count()
        self.login_user(self.client, self.other_manager_data)

        response = self.client.delete(f'/vacancies/{vacancy.id}/')

        self.assertEqual(response.status_code, 204)
        self.assertNotEqual(count_before, 0)
        self.assertEqual(department.vacancy_set.count(), 0)

    def test_DeleteVacancyByPk_ShouldDeleteVacancy_OnAdmin(self):
        department = User.objects.get(email=self.other_manager_data.email).department
        vacancy = self.create_vacancy_for(department)
        count_before = department.vacancy_set.count()
        self.login_user(self.client, self.admin_data)

        response = self.client.delete(f'/vacancies/{vacancy.id}/')

        self.assertEqual(response.status_code, 204)
        self.assertNotEqual(count_before, 0)
        self.assertEqual(department.vacancy_set.count(), 0)

    def test_VacancyResponse_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(f'/vacancies/{self.get_existing_vacancy_id()}/response/')

        print(json.loads(*response))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_VacancyResponse_ShouldRaise404_OnNonExistentVacancy(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post(f'/vacancies/{self.get_nonexistent_vacancy_id()}/response/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_VacancyResponse_ShouldRaise400_WithoutAnyResume(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post(f'/vacancies/{self.get_existing_vacancy_id()}/response/')

        self.assertEqual(response.status_code, 400)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Employee does not have resume')

    def test_VacancyResponse_ShouldRaise400_OnVacancyDepartmentHasNotManager(self):
        department = Department.objects.create(name="department_without_manager")
        vacancy = self.create_vacancy_for(department)
        self.login_user(self.client, self.employee_data)

        response = self.client.post(f'/vacancies/{vacancy.id}/response/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Vacancy department does not have manager')
        department.delete()

    def test_VacancyResponse_ShouldSendResponse_WithPdfResume(self):
        self.login_user(self.client, self.employee_data)
        vacancy_id = self.get_existing_vacancy_id()
        vacancy = Vacancy.objects.get(id=vacancy_id)
        manager_id = User.objects.get(department__id=vacancy.department.id)
        employee_id = User.objects.get(email=self.employee_data.email).id

        response = self.client.post(f'/vacancies/{vacancy_id}/response/',
                                    {'resume': SimpleUploadedFile('test.pdf', b'resume')})

        self.assertEqual(response.status_code, 200)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, f'Response from Employee(ID={employee_id}) to Manager(ID={manager_id}) successful')

    def test_VacancyResponse_ShouldSendResponse_WithUserResume(self):
        self.login_user(self.client, self.employee_data)
        vacancy_id = self.get_existing_vacancy_id()
        vacancy = Vacancy.objects.get(id=vacancy_id)
        manager_id = User.objects.get(department__id=vacancy.department.id)
        employee = User.objects.get(email=self.employee_data.email)
        resume = create_resume_for(employee, resume_data)

        response = self.client.post(f'/vacancies/{vacancy_id}/response/')

        self.assertEqual(response.status_code, 200)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, f'Response from Employee(ID={employee.id}) to Manager(ID={manager_id}) successful')
        resume.delete()

    def create_vacancy_for(self, department):
        data = dict(self.vacancy_data)
        del data['isActive']
        del data['requiredSkillsIds']
        vacancy = Vacancy.objects.create(department=department, is_active=True, **data)
        vacancy.save()
        return vacancy

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

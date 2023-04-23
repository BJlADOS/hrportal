import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..views import *


class VacancyTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    other_manager_data = UserData('manager', 'other-manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(**cls.employee_data.__dict__)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        department = create_department(manager)
        skills = [create_skill(), create_skill(), create_skill()]
        cls.skills = skills
        create_vacancy_for(department, default_vacancy_data, [s.id for s in skills])
        other_manager = User.objects.create_user(**cls.other_manager_data.__dict__)
        create_department(other_manager)
        User.objects.create_superuser(**cls.admin_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_GetVacancies_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(reverse("vacancy-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostVacancies_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(reverse("vacancy-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostVacancies_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("vacancy-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PostVacancies_ShouldRaiseValidationError_OnBlankData(self):
        login_user(self.client, self.manager_data)

        response = self.client.post(reverse("vacancy-list"), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['position'][0], 'This field is required.')
        self.assertEqual(errors['salary'][0], 'This field is required.')
        self.assertEqual(errors['employment'][0], 'This field is required.')
        self.assertEqual(errors['schedule'][0], 'This field is required.')
        self.assertEqual(errors['requiredSkillsIds'][0], 'This field is required.')

    def test_PostVacancies_ShouldCreateVacancy(self):
        login_user(self.client, self.other_manager_data)
        department = User.objects.get(email=self.other_manager_data.email).department

        response = self.client.post(reverse("vacancy-list"), default_vacancy_data)

        self.assertEqual(response.status_code, 201)
        result = json.loads(*response)
        vacancy = Vacancy.objects.get(department=department)
        self.assertDictEqual(result, get_vacancy_serialized_dict(vacancy))
        vacancy.delete()

    def test_GetVacancies_ShouldGetVacanciesInfo(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("vacancy-list"))

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        vacancies: list = [get_vacancy_serialized_dict(vac) for vac in Vacancy.objects.filter(status='PUBLIC')]
        self.assertListEqual(sorted(result), sorted(vacancies))

    def test_GetVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("vacancy-detail", args=(self.get_nonexistent_vacancy_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_GetVacancyByPk_ShouldGetVacanciesInfo(self):
        login_user(self.client, self.employee_data)
        _id = self.get_existing_vacancy_id()

        response = self.client.get(reverse("vacancy-detail", args=(_id,)))

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        vacancy = Vacancy.objects.get(id=_id)
        self.assertDictEqual(result, get_vacancy_serialized_dict(vacancy))

    def test_PatchVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PatchVacancyByPk_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PatchVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        login_user(self.client, self.manager_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.get_nonexistent_vacancy_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_PatchVacancyByPk_ShouldRaise403_OnNotYoursVacancy(self):
        login_user(self.client, self.other_manager_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_PatchVacancyByPk_ShouldChangeVacancy(self):
        login_user(self.client, self.manager_data)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_before = get_vacancy_serialized_dict(vacancy)

        response = self.client.patch(f'/api/vacancies/{self.get_existing_vacancy_id()}/',
                                     {'requiredSkillsIds': [self.skills[0].id, self.skills[1].id]},
                                     content_type="application/json")
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"result body - {result}")
        vacancy = Vacancy.objects.get(id=result['id'])
        vacancy_after = get_vacancy_serialized_dict(vacancy)
        self.assertDictEqual(result, vacancy_after)
        vacancy_before['modifiedAt'] = vacancy_after['modifiedAt']
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['requiredSkills'] = vacancy_after['requiredSkills']
        self.assertDictEqual(vacancy_before, vacancy_after)

    def test_PatchVacancyByPk_ShouldChangeVacancy_OnAdmin(self):
        login_user(self.client, self.admin_data)
        vacancy = User.objects.get(email=self.manager_data.email).department.vacancy_set.first()
        vacancy_before = get_vacancy_serialized_dict(vacancy)

        response = self.client.patch(f'/api/vacancies/{self.get_existing_vacancy_id()}/',
                                     {'requiredSkillsIds': [self.skills[0].id]},
                                     content_type="application/json")
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"result body - {result}")
        vacancy = Vacancy.objects.get(id=result['id'])
        vacancy_after = get_vacancy_serialized_dict(vacancy)
        self.assertDictEqual(result, vacancy_after)
        vacancy_before['modifiedAt'] = vacancy_after['modifiedAt']
        self.assertNotEqual(vacancy_before, vacancy_after)
        vacancy_before['requiredSkills'] = vacancy_after['requiredSkills']
        self.assertDictEqual(vacancy_before, vacancy_after)

    def test_DeleteVacancyByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.delete(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_DeleteVacancyByPk_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.delete(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_DeleteVacancyByPk_ShouldRaise404_OnNonExistentVacancy(self):
        login_user(self.client, self.manager_data)

        response = self.client.delete(reverse("vacancy-detail", args=(self.get_nonexistent_vacancy_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_DeleteVacancyByPk_ShouldRaise403_OnNotYoursVacancy(self):
        login_user(self.client, self.other_manager_data)

        response = self.client.delete(reverse("vacancy-detail", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_DeleteVacancyByPk_ShouldDeleteVacancy(self):
        department = User.objects.get(email=self.other_manager_data.email).department
        vacancy = create_vacancy_for(department, default_vacancy_data)
        count_before = department.vacancy_set.exclude(status='DELETED').count()
        login_user(self.client, self.other_manager_data)

        response = self.client.delete(reverse("vacancy-detail", args=(vacancy.id,)))

        self.assertEqual(response.status_code, 204)
        self.assertNotEqual(count_before, 0)
        count_after = department.vacancy_set.exclude(status='DELETED').count()
        self.assertEqual(count_after, 0)

    def test_DeleteVacancyByPk_ShouldDeleteVacancy_OnAdmin(self):
        department = User.objects.get(email=self.other_manager_data.email).department
        vacancy = create_vacancy_for(department, default_vacancy_data)
        count_before = department.vacancy_set.exclude(status='DELETED').count()
        login_user(self.client, self.admin_data)

        response = self.client.delete(reverse("vacancy-detail", args=(vacancy.id,)))

        self.assertEqual(response.status_code, 204)
        self.assertNotEqual(count_before, 0)
        count_after = department.vacancy_set.exclude(status='DELETED').count()
        self.assertEqual(count_after, 0)

    def test_FinalDeleteVacancyByPk_ShouldRaise403_OnManager(self):
        login_user(self.client, self.manager_data)

        response = self.client.delete(reverse("vacancy-final-delete", args=(self.get_existing_vacancy_id(),)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 403, msg=f"response body - {result}")
        self.assertEqual(result['detail'], "You do not have permission to perform this action.")

    def test_FinalDeleteVacancyByPk_ShouldRaise404_OnManager_OnNonExistentVacancy(self):
        login_user(self.client, self.admin_data)

        response = self.client.delete(reverse("vacancy-final-delete", args=(self.get_nonexistent_vacancy_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_FinalDeleteVacancyByPk_ShouldDeleteVacancy_OnAdmin(self):
        login_user(self.client, self.admin_data)
        vacancy = Vacancy.objects.get(id=self.get_existing_vacancy_id())

        response = self.client.delete(reverse("vacancy-final-delete", args=(vacancy.id,)))

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Vacancy.objects.contains(vacancy))
        vacancy.save()
        self.assertTrue(Vacancy.objects.contains(vacancy))

    def test_VacancyResponse_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(reverse("vacancy-response", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_VacancyResponse_ShouldRaise404_OnNonExistentVacancy(self):
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("vacancy-response", args=(self.get_nonexistent_vacancy_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_VacancyResponse_ShouldRaise400_WithoutAnyResume(self):
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("vacancy-response", args=(self.get_existing_vacancy_id(),)))

        self.assertEqual(response.status_code, 400)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Employee does not have resume')

    def test_VacancyResponse_ShouldRaise400_OnVacancyDepartmentHasNotManager(self):
        department = Department.objects.create(name="department_without_manager")
        vacancy = create_vacancy_for(department, default_vacancy_data)
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("vacancy-response", args=(vacancy.id,)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Vacancy department does not have manager')
        department.delete()

    def test_VacancyResponse_ShouldSendResponse_WithPdfResume(self):
        login_user(self.client, self.employee_data)
        vacancy_id = self.get_existing_vacancy_id()
        vacancy = Vacancy.objects.get(id=vacancy_id)
        manager = User.objects.get(department__id=vacancy.department.id)
        employee_id = User.objects.get(email=self.employee_data.email).id

        response = self.client.post(reverse("vacancy-response", args=(vacancy_id,)),
                                    {'resume': SimpleUploadedFile('test.pdf', b'resume')})

        self.assertEqual(response.status_code, 200)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, f'Response from Employee(ID={employee_id}) to Manager(ID={manager.id}) mail sending successful')

    def test_VacancyResponse_ShouldSendResponse_WithUserResume(self):
        vacancy_id = self.get_existing_vacancy_id()
        vacancy = Vacancy.objects.get(id=vacancy_id)
        manager = User.objects.get(department__id=vacancy.department.id)
        employee = User.objects.get(email=self.employee_data.email)
        resume = create_resume_for(employee, default_resume_data)
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("vacancy-response", args=(vacancy_id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"result body - {result}")
        detail = result['detail']
        self.assertEqual(detail, f'Response from Employee(ID={employee.id}) to Manager(ID={manager.id}) mail sending successful')
        resume.delete()

    @staticmethod
    def get_existing_vacancy_id():
        return Vacancy.objects.all().first().id

    @staticmethod
    def get_nonexistent_vacancy_id():
        return Vacancy.objects.all().last().id + 1

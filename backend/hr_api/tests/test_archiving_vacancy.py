import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..models import User, Department


class VacancyArchivingTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager1_data = UserData('manager1', 'manager1@hrportal.com', 'password')
    manager2_data = UserData('manager2', 'manager2@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        Skill.objects.create(name="skill").save()
        Skill.objects.create(name="skill").save()
        Skill.objects.create(name="skill").save()

        User.objects.create_user(**cls.employee_data.__dict__)

        manager1 = User.objects.create_user(**cls.manager1_data.__dict__)
        department1 = Department.objects.create(name="department1", manager=manager1)
        department1.save()
        cls.dep1_vacancy1 = create_vacancy_for(department1, default_vacancy_data)
        cls.dep1_vacancy2 = create_vacancy_for(department1, default_vacancy_data)

        manager2 = User.objects.create_user(**cls.manager2_data.__dict__)
        department2 = Department.objects.create(name="department2", manager=manager2)
        department2.save()
        cls.dep2_vacancy1 = create_vacancy_for(department2, default_vacancy_data)

    def setUp(self):
        self.client = Client()

    def test_Manager_PublishHisVacancy(self):
        self.dep1_vacancy1.archive()
        login_user(self.client, self.manager1_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.dep1_vacancy1.id,)),
                                     {'status': 'PUBLIC'},
                                     content_type='application/json')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.dep1_vacancy1.refresh_from_db()
        self.assertEqual(self.dep1_vacancy1.status, 'PUBLIC')
        self.assertDictEqual(result, get_vacancy_serialized_dict(self.dep1_vacancy1))

    def test_Manager_ArchiveHisVacancy(self):
        self.dep1_vacancy1.publish()
        login_user(self.client, self.manager1_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.dep1_vacancy1.id,)),
                                     {'status': 'ARCHIVED'},
                                     content_type='application/json')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.dep1_vacancy1.refresh_from_db()
        self.assertEqual(self.dep1_vacancy1.status, 'ARCHIVED')
        self.assertDictEqual(result, get_vacancy_serialized_dict(self.dep1_vacancy1))

    def test_Manager_SoftDeleteHisVacancy(self):
        self.dep1_vacancy1.publish()
        login_user(self.client, self.manager1_data)

        response = self.client.delete(reverse("vacancy-detail", args=(self.dep1_vacancy1.id,)))

        self.assertEqual(response.status_code, 204)
        self.dep1_vacancy1.refresh_from_db()
        self.assertEqual(self.dep1_vacancy1.status, 'DELETED')

    def test_Manager_PublishSomeoneElseVacancy(self):
        login_user(self.client, self.manager1_data)

        response = self.client.patch(reverse("vacancy-detail", args=(self.dep2_vacancy1.id,)),
                                     {'status': 'PUBLIC'},
                                     content_type='application/json')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 403, msg=f"response body - {result}")
        self.assertEqual(result['detail'], "You do not have permission to perform this action.")

    def test_Employee_GetOnlyPublicVacancies(self):
        self.vacancies_to_standard_state()
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("vacancy-list"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], get_vacancy_serialized_dict(self.dep1_vacancy1))

    def test_Manager_GetPublicVacancies_And_HisArchivedVacancies(self):
        self.vacancies_to_standard_state()
        self.dep2_vacancy1.archive()

        login_user(self.client, self.manager1_data)

        response = self.client.get(reverse("vacancy-list"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0], get_vacancy_serialized_dict(self.dep1_vacancy1))
        self.assertEqual(result[1], get_vacancy_serialized_dict(self.dep1_vacancy2))

    def test_Manager_GetPublicVacancies(self):
        self.vacancies_to_standard_state()
        self.dep2_vacancy1.archive()

        login_user(self.client, self.manager1_data)

        response = self.client.get(reverse("vacancy-list") + "?status=PUBLIC")
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], get_vacancy_serialized_dict(self.dep1_vacancy1))

    def test_Manager_GetHisArchivedVacancies(self):
        self.vacancies_to_standard_state()

        login_user(self.client, self.manager1_data)

        response = self.client.get(reverse("vacancy-list") + "?status=ARCHIVED")
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], get_vacancy_serialized_dict(self.dep1_vacancy2))

    def vacancies_to_standard_state(self):
        self.dep1_vacancy1.publish()
        self.dep1_vacancy2.archive()
        self.dep2_vacancy1.soft_delete()

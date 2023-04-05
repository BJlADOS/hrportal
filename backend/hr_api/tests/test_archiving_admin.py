import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *


class ArchivingAdminTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        Skill.objects.create(name="skill").save()
        Skill.objects.create(name="skill").save()
        Skill.objects.create(name="skill").save()

        archived_resume_data = default_resume_data.copy()
        archived_resume_data['status'] = 'ARCHIVED'
        deleted_resume_data = default_resume_data.copy()
        deleted_resume_data['status'] = 'DELETED'
        cls.resumes = [
            create_resume_for(None, default_resume_data),
            create_resume_for(None, archived_resume_data),
            create_resume_for(None, deleted_resume_data)
        ]
        archived_vacancy_data = default_vacancy_data.copy()
        archived_vacancy_data['status'] = 'ARCHIVED'
        deleted_vacancy_data = default_vacancy_data.copy()
        deleted_vacancy_data['status'] = 'DELETED'
        cls.vacancies = [
            create_vacancy_for(None, default_vacancy_data),
            create_vacancy_for(None, archived_vacancy_data),
            create_vacancy_for(None, deleted_vacancy_data)
        ]
        User.objects.create_superuser(**cls.admin_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_Admin_GetAllResumes(self):
        login_user(self.client, self.admin_data)

        response = self.client.get(reverse("resume-list"))
        result = json.loads(*response)
        print(result)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), len(self.resumes))
        for i in range(0, len(result)):
            resume = Resume.objects.get(id=result[i]['id'])
            result[i]['resume'] = resume.resume.url
            self.assertDictEqual(result[i], get_resume_serialized_dict(self.resumes[i]))

    def test_Admin_GetAllVacancies(self):
        login_user(self.client, self.admin_data)

        response = self.client.get(reverse("vacancy-list"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), len(self.vacancies))
        for i in range(0, len(result)):
            self.assertDictEqual(result[i], get_vacancy_serialized_dict(self.vacancies[i]))

import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..views import *


class ResumeTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        create_resume_for(employee, default_resume_data)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        Department.objects.create(name="department", manager=manager).save()

    def setUp(self):
        self.client = Client()

    def test_GetResumes_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(reverse("resume-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetResumes_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("resume-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetResumes_ShouldGetResumesInfo(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse("resume-list"))

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resumes: list = [get_resume_serialized_dict(resume) for resume in Resume.objects.all()]
        self.assertListEqual(sorted(result), sorted(resumes))

    def test_GetResumeByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(reverse("resume-detail", args=(self.get_existing_resume_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetResumeByPk_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("resume-detail", args=(self.get_existing_resume_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetResumeByPk_ShouldRaise404_OnNonExistentResume(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse("resume-detail", args=(self.get_nonexistent_resume_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_GetResumeByPk_ShouldReturnResumeInfo(self):
        login_user(self.client, self.manager_data)
        _id = self.get_existing_resume_id()
        response = self.client.get(reverse("resume-detail", args=(_id,)))

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resume = get_resume_serialized_dict(Resume.objects.get(id=_id))
        self.assertDictEqual(result, resume)

    def test_ResumeResponse_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(reverse("resume_response", args=(self.get_existing_resume_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_ResumeResponse_ShouldRaise403_OnEmployee(self):
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("resume_response", args=(self.get_existing_resume_id(),)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_ResumeResponse_ShouldRaise404_OnNonExistentResume(self):
        login_user(self.client, self.manager_data)

        response = self.client.post(reverse("resume_response", args=(self.get_nonexistent_resume_id(),)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_ResumeResponse_ShouldSendResponse(self):
        manager_id = User.objects.get(email=self.manager_data.email).id
        resume_id = self.get_existing_resume_id()
        employee_id = User.objects.get(resume__id=resume_id).id
        login_user(self.client, self.manager_data)

        response = self.client.post(reverse("resume_response", args=(resume_id,)))

        self.assertEqual(response.status_code, 200)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, f'Response from Manager(ID={manager_id}) to Employee(ID={employee_id}) successful')

    @staticmethod
    def get_existing_resume_id():
        return Resume.objects.all().first().id

    @staticmethod
    def get_nonexistent_resume_id():
        return Resume.objects.all().last().id + 1

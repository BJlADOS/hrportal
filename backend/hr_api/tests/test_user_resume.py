import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..serializers import *


class UserResumeTests(TestCase):
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

    def test_GetUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(reverse("user-resume"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetUserResume_ShouldRaise404_OnUserWithoutResume(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse("user-resume"))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_GetUserResume_ShouldGetResumeInfo(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("user-resume"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resume = get_resume_serialized_dict(Resume.objects.get(employee__email=self.employee_data.email))
        self.assertDictEqual(result, resume)

    def test_PostUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(reverse("user-resume"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostUserResume_ShouldRaise409_OnUserWithResume(self):
        login_user(self.client, self.employee_data)

        response = self.client.post(reverse("user-resume"))

        self.assertEqual(response.status_code, 409)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'This employee already has a resume')

    def test_PostUserResume_ShouldRaiseValidationError_OnBlankData(self):
        login_user(self.client, self.manager_data)

        response = self.client.post(reverse("user-resume"))

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['desiredPosition'][0], 'This field is required.')
        self.assertEqual(errors['desiredSalary'][0], 'This field is required.')
        self.assertEqual(errors['desiredEmployment'][0], 'This field is required.')
        self.assertEqual(errors['desiredSchedule'][0], 'This field is required.')
        self.assertEqual(errors['resume'][0], 'No file was submitted.')

    def test_PostUserResume_ShouldCreateResume(self):
        login_user(self.client, self.manager_data)

        data = dict(default_resume_data)
        data['resume'] = SimpleUploadedFile("test.pdf", b"resume")
        response = self.client.post(reverse("user-resume"), data)

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resume = Resume.objects.get(employee__email=self.manager_data.email)
        self.assertDictEqual(result, get_resume_serialized_dict(resume))
        resume.delete()

    def test_PatchUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch(reverse("user-resume"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PatchUserResume_ShouldRaise404_OnUserWithoutResume(self):
        login_user(self.client, self.manager_data)

        response = self.client.patch(reverse("user-resume"))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_PatchUserResume_ShouldDontRaiseException_OnBlankData(self):
        login_user(self.client, self.employee_data)
        resume_before = Resume.objects.get(employee__email=self.employee_data.email)
        resume_before = get_resume_serialized_dict(resume_before)

        response = self.client.patch(reverse("user-resume"))

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resume_after = Resume.objects.get(id=result['id'])
        resume_after = get_resume_serialized_dict(resume_after)
        self.assertDictEqual(result, resume_after)
        self.assertNotEqual(resume_before['modifiedAt'], resume_after['modifiedAt'])
        resume_after['modifiedAt'] = resume_before['modifiedAt']
        self.assertDictEqual(resume_before, resume_after)

    def test_PatchUserResume_ShouldChangeResume(self):
        login_user(self.client, self.employee_data)
        resume_before = Resume.objects.get(employee__email=self.employee_data.email)
        resume_before = get_resume_serialized_dict(resume_before)

        response = self.client.patch(reverse("user-resume"), {'status': 'ARCHIVED'}, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        result = json.loads(*response)
        resume_after = Resume.objects.get(id=result['id'])
        resume_after = get_resume_serialized_dict(resume_after)
        self.assertDictEqual(result, resume_after)
        self.assertNotEqual(resume_before['modifiedAt'], resume_after['modifiedAt'])
        resume_after['modifiedAt'] = resume_before['modifiedAt']
        self.assertNotEqual(resume_before, resume_after)
        resume_after['status'] = resume_before['status']
        self.assertDictEqual(resume_before, resume_after)

    def test_DeleteUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.delete(reverse("user-resume"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_DeleteUserResume_ShouldRaise404_OnUserWithoutResume(self):
        login_user(self.client, self.manager_data)

        response = self.client.delete(reverse("user-resume"))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_DeleteUserResume_ShouldDeleteResume(self):
        manager = User.objects.get(email=self.manager_data.email)
        create_resume_for(manager, default_resume_data)
        login_user(self.client, self.manager_data)

        response = self.client.delete(reverse("user-resume"))

        self.assertEqual(response.status_code, 204)
        self.assertTrue(len(Resume.objects
                            .filter(employee=manager)
                            .exclude(status='DELETED')) == 0)

    @staticmethod
    def get_existing_resume_id():
        return Resume.objects.all().first().id

    @staticmethod
    def get_nonexistent_resume_id():
        return Resume.objects.all().last().id + 1

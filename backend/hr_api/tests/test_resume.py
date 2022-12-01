import json

from django.core.files import File
from django.test import TestCase, Client

from .test_reg_auth import UserData
from ..serializers import *


class ResumeTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    resume_data = {
        'desiredPosition': 'position',
        'desiredSalary': 0,
        'desiredEmployment': 'PART',
        'desiredSchedule': 'DISTANT',
        'isActive': True
    }

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        cls.create_resume_for(employee, cls)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        Department.objects.create(name="department", manager=manager).save()

    def setUp(self):
        self.client = Client()

    # TODO Тесты на проверку возвращаемой информации о резюме

    def test_GetResumes_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get('/resumes/', {})

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetResumes_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get('/resumes/', {})

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetResumes_ShouldGetResumesInfo(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get('/resumes/')

        self.assertEqual(response.status_code, 200)

    def test_GetResumeByPk_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(f'/resumes/{self.get_existing_resume_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetResumeByPk_ShouldRaise403_OnEmployee(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get(f'/resumes/{self.get_existing_resume_id()}/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_GetResumeByPk_ShouldRaise404_OnNonExistentResumeId(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get(f'/resumes/{self.get_nonexistent_resume_id()}/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_GetResumeByPk_ShouldReturnResumeInfo(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get(f'/resumes/{self.get_existing_resume_id()}/')

        self.assertEqual(response.status_code, 200)

    def test_GetUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.get(f'/user/resume/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_GetUserResume_ShouldRaise404_OnUserWithoutResume(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.get(f'/user/resume/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_GetUserResume_ShouldGetResumeInfo(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.get(f'/user/resume/')

        self.assertEqual(response.status_code, 200)

    # TODO Тесты на валидацию передаваемых в Post и Patch значений и создание и изменение резюме

    def test_PostUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.post(f'/user/resume/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PostUserResume_ShouldRaise409_OnUserWithResume(self):
        self.login_user(self.client, self.employee_data)

        response = self.client.post(f'/user/resume/')

        self.assertEqual(response.status_code, 409)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'This employee already has a resume')

    def test_PostUserResume_ShouldRaiseValidationError_OnBlankData(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.post(f'/user/resume/')

        self.assertEqual(response.status_code, 400)
        errors = json.loads(*response)
        self.assertEqual(errors['desiredPosition'][0], 'This field is required.')
        self.assertEqual(errors['desiredSalary'][0], 'This field is required.')
        self.assertEqual(errors['desiredEmployment'][0], 'This field is required.')
        self.assertEqual(errors['desiredSchedule'][0], 'This field is required.')
        self.assertEqual(errors['resume'][0], 'No file was submitted.')
        self.assertEqual(errors['isActive'][0], 'This field is required.')

    def test_PostUserResume_ShouldCreateResume(self):
        self.login_user(self.client, self.manager_data)

        with open("hr_api/tests/test_resume.pdf", "rb") as pdf:
            data = dict(self.resume_data)
            data['resume'] = pdf
            response = self.client.post(f'/user/resume/', data)

        self.assertEqual(response.status_code, 200)
        User.objects.get(email=self.manager_data.email).resume.delete()

    def test_PatchUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.patch('/user/resume/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_PatchUserResume_ShouldRaise404_OnUserWithoutResume(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.patch('/user/resume/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_PatchUserResume_ShouldDontRaiseException_OnBlankData(self):
        self.login_user(self.client, self.employee_data)
        resume_before = GetResumeSerializer(User.objects.get(email=self.employee_data.email).resume).data

        response = self.client.patch('/user/resume/')

        self.assertEqual(response.status_code, 200)
        resume_after = GetResumeSerializer(User.objects.get(email=self.employee_data.email).resume).data
        self.assertNotEqual(resume_before['modifiedAt'], resume_after['modifiedAt'])
        resume_after['modifiedAt'] = resume_before['modifiedAt']
        self.assertEqual(resume_before, resume_after)

    def test_PatchUserResume_ShouldChangeResume(self):
        self.login_user(self.client, self.employee_data)
        resume_before = GetResumeSerializer(User.objects.get(email=self.employee_data.email).resume).data

        response = self.client.patch('/user/resume/', {'isActive': False}, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        resume_after = GetResumeSerializer(User.objects.get(email=self.employee_data.email).resume).data
        self.assertNotEqual(resume_before['modifiedAt'], resume_after['modifiedAt'])
        resume_after['modifiedAt'] = resume_before['modifiedAt']
        self.assertNotEqual(resume_before, resume_after)
        resume_after['isActive'] = resume_before['isActive']
        self.assertEqual(resume_before, resume_after)

    def test_DeleteUserResume_ShouldRaise403_OnUnauthorizedClient(self):
        response = self.client.delete('/user/resume/')

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_DeleteUserResume_ShouldRaise404_OnUserWithoutResume(self):
        self.login_user(self.client, self.manager_data)

        response = self.client.delete('/user/resume/')

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, "This employee doesn't have a resume")

    def test_DeleteUserResume_ShouldDeleteResume(self):
        manager = User.objects.get(email=self.manager_data.email)
        self.create_resume_for(manager, self)
        self.login_user(self.client, self.manager_data)

        response = self.client.delete('/user/resume/')

        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.client.get('/user/resume/').status_code, 404)

    @staticmethod
    def create_resume_for(user, resume_tests):
        with open("hr_api/tests/test_resume.pdf", "rb") as pdf:
            return Resume.objects.create(employee=user,
                                         desired_position=resume_tests.resume_data['desiredPosition'],
                                         desired_salary=resume_tests.resume_data['desiredSalary'],
                                         desired_employment=resume_tests.resume_data['desiredEmployment'],
                                         desired_schedule=resume_tests.resume_data['desiredSchedule'],
                                         resume=File(pdf),
                                         is_active=resume_tests.resume_data['isActive'])

    # TODO Тесты на работу отклика на резюме

    @staticmethod
    def get_existing_resume_id():
        return Resume.objects.all().first().id

    @staticmethod
    def get_nonexistent_resume_id():
        return Resume.objects.all().last().id + 1

    @staticmethod
    def login_user(client, user_data):
        login_data = {'email': user_data.email, 'password': user_data.password}
        client.post('/login/', login_data)

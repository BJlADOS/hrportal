import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..models import User


class ResumeArchivingTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        cls.employee_resume = create_resume_for(employee, default_resume_data)

        manager = User.objects.create_user(**cls.manager_data.__dict__)
        Department.objects.create(name="department", manager=manager)

        User.objects.create_superuser(**cls.admin_data.__dict__)

    def setUp(self):
        self.client = Client()

    def test_Employee_PublishHisResume(self):
        self.employee_resume.archive()
        login_user(self.client, self.employee_data)

        response = self.client.patch(reverse("user-resume"),
                                     {'status': 'PUBLIC'},
                                     content_type='application/json')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.employee_resume.refresh_from_db()
        self.assertEqual(self.employee_resume.status, 'PUBLIC')
        self.assertDictEqual(result, get_resume_serialized_dict(self.employee_resume))

    def test_Employee_ArchiveHisResume(self):
        self.employee_resume.publish()
        login_user(self.client, self.employee_data)

        response = self.client.patch(reverse("user-resume"),
                                     {'status': 'ARCHIVED'},
                                     content_type='application/json')
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.employee_resume.refresh_from_db()
        self.assertEqual(self.employee_resume.status, 'ARCHIVED')
        self.assertDictEqual(result, get_resume_serialized_dict(self.employee_resume))

    def test_Employee_SoftDeleteHisResume(self):
        self.employee_resume.publish()
        login_user(self.client, self.employee_data)

        response = self.client.delete(reverse("user-resume"))

        self.assertEqual(response.status_code, 204)
        self.employee_resume.refresh_from_db()
        self.assertEqual(self.employee_resume.status, 'DELETED')

    def test_Employee_SoftDeleteHisNonExistentResume(self):
        self.employee_resume.delete()
        login_user(self.client, self.employee_data)

        response = self.client.delete(reverse("user-resume"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 404, msg=f"response body - {result}")
        self.assertEqual(result['detail'], "This employee doesn't have a resume")
        self.employee_resume.save()

    def test_Employee_GetHisExistingPublicResume(self):
        self.employee_resume.publish()
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("user-resume"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.employee_resume.refresh_from_db()
        self.assertDictEqual(result, get_resume_serialized_dict(self.employee_resume))

    def test_Employee_GetHisExistingDeletedResume(self):
        self.employee_resume.status = 'DELETED'
        self.employee_resume.save()
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("user-resume"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 404)
        self.assertEqual(result['detail'], "This employee doesn't have a resume")

    def test_Employee_GetHisNonExistentResume(self):
        self.employee_resume.delete()
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse("user-resume"))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 404, msg=f"response body - {result}")
        self.assertEqual(result['detail'], "This employee doesn't have a resume")
        self.employee_resume.save()

    def test_Employee_GetOnlyPublicResumes(self):
        self.employee_resume.archive()
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse('resume-list'))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200, msg=f"response body - {result}")
        self.assertEqual(len(result), 0)

    def test_Manager_CantSoftDeleteResumeByPk(self):
        login_user(self.client, self.manager_data)
        resume_id = get_existing_resume_id()

        response = self.client.delete(reverse('resume-detail', args=(resume_id,)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_Admin_CantSoftDeleteResumeByPk_OnNonExistentResume(self):
        login_user(self.client, self.admin_data)
        resume_id = get_nonexistent_resume_id()

        response = self.client.delete(reverse('resume-detail', args=(resume_id,)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_Admin_SoftDeleteResumeByPk(self):
        login_user(self.client, self.admin_data)
        resume = Resume.objects.get(id=get_existing_resume_id())
        self.assertNotEquals(resume.status, 'DELETED')

        response = self.client.delete(reverse('resume-detail', args=(resume.id,)))

        self.assertEqual(response.status_code, 204)
        resume.refresh_from_db()
        self.assertEqual(resume.status, 'DELETED')
        resume.publish()

    def test_Manager_CantFinalDeleteResumeByPk(self):
        login_user(self.client, self.manager_data)
        resume_id = get_existing_resume_id()

        response = self.client.delete(reverse('resume-final-delete', args=(resume_id,)))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'You do not have permission to perform this action.')

    def test_Admin_CantFinalDeleteResumeByPk_OnNonExistentResume(self):
        login_user(self.client, self.admin_data)
        resume_id = get_nonexistent_resume_id()

        response = self.client.delete(reverse('resume-final-delete', args=(resume_id,)))

        self.assertEqual(response.status_code, 404)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Not found.')

    def test_FinalDeleteResumeByPk_ShouldDeleteVacancy_OnAdmin(self):
        login_user(self.client, self.admin_data)
        resume = Resume.objects.get(id=get_existing_resume_id())

        response = self.client.delete(reverse('resume-final-delete', args=(resume.id,)))

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Resume.objects.contains(resume))
        resume.save()
        self.assertTrue(Resume.objects.contains(resume))

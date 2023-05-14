import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..views import *


class NotificationsTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        res = create_resume_for(employee, default_resume_data)
        cls.resume = res

        manager = User.objects.create_user(**cls.manager_data.__dict__)
        dep = create_department(manager)
        vac = create_vacancy_for(dep, default_vacancy_data)
        cls.vacancy = vac

        cls.resume_notification = Notification.resume_response(res, manager)
        cls.resume_notification_data = {
            'manager': manager.id,
            'department': manager.department.id,
            'employee': res.employee.id
        }
        cls.vacancy_notification = Notification.vacancy_response(vac, manager, employee, res)
        cls.vacancy_notification_data = {
            'employee': employee.id,
            'department': dep.id,
            'vacancy': vac.id,
            'resume': res.file.url[len(settings.MEDIA_URL):]
        }

    def setUp(self):
        self.client = Client()

    def test_NotUnauthorizedClient_DontReceiveNotifications(self):
        response = self.client.get(reverse("notification-list"))

        self.assertEqual(response.status_code, 403)
        detail = json.loads(*response)['detail']
        self.assertEqual(detail, 'Authentication credentials were not provided.')

    def test_Employee_ReceiveNotifications(self):
        login_user(self.client, self.employee_data)

        response = self.client.get(reverse('notification-list'))
        result: list[dict] = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        for notif in result:
            db_notif = Notification.objects.get(id=notif['id'])
            self.assertDictEqual(notif, get_notification_serialized_dict(db_notif))
        notif = self.resume_notification
        notif.refresh_from_db()
        self.assertTrue(get_notification_serialized_dict(notif) in result)
        notif_for_other = self.vacancy_notification
        notif_for_other.refresh_from_db()
        self.assertFalse(get_notification_serialized_dict(notif_for_other) in result)

    def test_Manager_ReceiveNotifications(self):
        login_user(self.client, self.manager_data)

        response = self.client.get(reverse('notification-list'))
        result: list[dict] = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        for notif in result:
            db_notif = Notification.objects.get(id=notif['id'])
            self.assertDictEqual(notif, get_notification_serialized_dict(db_notif))
        notif = self.vacancy_notification
        notif.refresh_from_db()
        self.assertTrue(get_notification_serialized_dict(notif) in result)
        notif_for_other = self.resume_notification
        notif_for_other.refresh_from_db()
        self.assertFalse(get_notification_serialized_dict(notif_for_other) in result)

    def test_Employee_ReceiveCorrectResumeNotification(self):
        login_user(self.client, self.employee_data)
        notif = self.resume_notification

        response = self.client.get(reverse("notification-detail", args=(notif.id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        notif.refresh_from_db()
        self.assertDictEqual(result, get_notification_serialized_dict(notif))
        self.assertDictEqual(result['value'], self.resume_notification_data)

    def test_Manager_ReceiveCorrectVacancyNotification(self):
        login_user(self.client, self.manager_data)
        notif = self.vacancy_notification

        response = self.client.get(reverse("notification-detail", args=(notif.id,)))
        result = json.loads(*response)

        self.assertEqual(response.status_code, 200)
        notif.refresh_from_db()
        self.assertDictEqual(result, get_notification_serialized_dict(notif))
        self.assertDictEqual(result['value'], self.vacancy_notification_data)

    def test_Employee_CanReceiveYourNotification(self):
        login_user(self.client, self.employee_data)
        notif = self.resume_notification
        notif.refresh_from_db()
        self.assertFalse(notif.read)

        response = self.client.patch(reverse("notification-read", args=(notif.id,)))

        self.assertEqual(response.status_code, 200)
        notif.refresh_from_db()
        self.assertTrue(notif.read)

    def test_Manager_CanReceiveYourNotification(self):
        login_user(self.client, self.manager_data)
        notif = self.vacancy_notification
        notif.refresh_from_db()
        self.assertFalse(notif.read)

        response = self.client.patch(reverse("notification-read", args=(notif.id,)))

        self.assertEqual(response.status_code, 200)
        notif.refresh_from_db()
        self.assertTrue(notif.read)

    def test_Employee_CantReceiveOtherNotification(self):
        login_user(self.client, self.employee_data)
        notif = self.vacancy_notification

        response = self.client.patch(reverse("notification-read", args=(notif.id,)))

        self.assertEqual(response.status_code, 404)

    def test_Employee_CanRespondToVacancy_WithExistingResume(self):
        login_user(self.client, self.employee_data)
        vac = self.vacancy

        response = self.client.post(reverse('vacancy-response', args=(vac.id,)))

        self.assertEqual(response.status_code, 200)
        latest_notification = Notification.objects.latest("notify_time")
        self.assertEqual(latest_notification.owner.id, vac.department.manager.id)
        self.assertEqual(latest_notification.type, 'VACANCY-RESPONSE')
        employee = User.objects.get(email=self.employee_data.email)
        res = Resume.objects.get(employee=employee)
        self.assertDictEqual(latest_notification.value,
                             {
                                 "employee": employee.id,
                                 "department": vac.department.id,
                                 "vacancy": vac.id,
                                 "resume": res.file.url[len(settings.MEDIA_URL):]
                             })

    def test_Employee_CanRespondToVacancy_WithNewResume(self):
        login_user(self.client, self.employee_data)
        vac = self.vacancy

        response = self.client.post(reverse("vacancy-response", args=(vac.id,)),
                                    {'resume': SimpleUploadedFile('test.pdf', b'resume')})

        self.assertEqual(response.status_code, 200)
        latest_notification = Notification.objects.latest("notify_time")
        self.assertEqual(latest_notification.owner.id, vac.department.manager.id)
        self.assertEqual(latest_notification.type, 'VACANCY-RESPONSE')
        employee = User.objects.get(email=self.employee_data.email)
        old_res = Resume.objects.get(employee=employee)
        new_res = PDFResume.objects.filter(employee=employee).exclude(id=old_res.id).first()
        self.assertNotEqual(old_res.id, new_res.id)
        self.assertDictEqual(latest_notification.value,
                             {
                                 "employee": employee.id,
                                 "department": vac.department.id,
                                 "vacancy": vac.id,
                                 "resume": new_res.file.url[len(settings.MEDIA_URL):]
                             })

    def test_Manager_CanRespondToResume(self):
        login_user(self.client, self.manager_data)
        res = self.resume

        response = self.client.post(reverse("resume-response", args=(res.id,)))

        self.assertEqual(response.status_code, 200)
        latest_notification = Notification.objects.latest("notify_time")
        self.assertEqual(latest_notification.owner.id, res.employee.id)
        self.assertEqual(latest_notification.type, 'RESUME-RESPONSE')
        manager = User.objects.get(email=self.manager_data.email)
        self.assertDictEqual(latest_notification.value,
                             {
                                 "manager": manager.id,
                                 "department": manager.department.id,
                                 "employee": res.employee.id
                             })

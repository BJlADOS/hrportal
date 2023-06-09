import json
from datetime import datetime

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..models import Grade, Activity, ActivityStatus


class ActivitiesTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)

        grade = Grade.objects.create(employee=employee, name='grade', expiration_date=datetime.now())
        grade.save()

        Activity.objects.create(grade=grade, name='activity1').save()
        Activity.objects.create(grade=grade, name='activity2').save()
        Activity.objects.create(grade=grade, name='activity3').save()
        Activity.objects.create(grade=grade, name='activity4').save()
        Activity.objects.create(grade=grade, name='activity5').save()
        Activity.objects.create(grade=grade, name='review activity1', status=ActivityStatus.ON_REVIEW.value).save()
        Activity.objects.create(grade=grade, name='review activity2', status=ActivityStatus.ON_REVIEW.value).save()

        manager = User.objects.create_user(**cls.manager_data.__dict__)

        department = create_department(manager)
        employee.current_department = department
        employee.save()

    def setUp(self):
        self.client = Client()

    def test_Employee_CanReceive_YourActivity(self):
        login_user(self.client, self.employee_data)
        db_activity = Activity.objects.filter(grade__employee__email=self.employee_data.email).first()

        response = self.client.get(reverse('activity-detail', args=[db_activity.id]))

        self.assertEqual(response.status_code, 200)
        activity = json.loads(*response)
        self.assertDictEqual(activity, get_activity_serialized_dict(db_activity))

    def test_Manager_CanReceive_EmployeeActivity(self):
        login_user(self.client, self.manager_data)
        db_activity = Activity.objects.filter(grade__employee__email=self.employee_data.email).first()

        response = self.client.get(reverse('activity-detail', args=[db_activity.id]))

        self.assertEqual(response.status_code, 200)
        activity = json.loads(*response)
        self.assertDictEqual(activity, get_activity_serialized_dict(db_activity))

    def test_Manager_CanCreate_Activity(self):
        login_user(self.client, self.manager_data)
        grade = Grade.objects.get(employee__email=self.employee_data.email)
        data = {
            'gradeId': grade.id,
            'name': 'new activity',
            'description': 'description'
        }

        response = self.client.post(reverse('activity-list'), data, content_type='application/json')

        self.assertEqual(response.status_code, 201)
        activity = json.loads(*response)
        db_activity = Activity.objects.get(id=activity['id'])
        self.assertDictEqual(activity, get_activity_serialized_dict(db_activity))

    def test_Manager_CanPatch_Activity(self):
        login_user(self.client, self.manager_data)
        db_activity = Activity.objects.filter(grade__employee__email=self.employee_data.email).first()
        data = {
            'name': 'new activity name',
            'description': 'new description'
        }

        response = self.client.patch(reverse('activity-detail', args=[db_activity.id]), data,
                                     content_type='application/json')

        self.assertEqual(response.status_code, 200)
        activity = json.loads(*response)
        activity_before = get_activity_serialized_dict(db_activity)
        db_activity.refresh_from_db()
        activity_after = get_activity_serialized_dict(db_activity)
        self.assertDictEqual(activity, activity_after)
        self.assertNotEqual(activity_before, activity_after)
        activity_before['name'] = activity_after['name']
        activity_before['description'] = activity_after['description']
        self.assertDictEqual(activity_before, activity_after)

    def test_Manager_CanDelete_Activity(self):
        login_user(self.client, self.manager_data)
        grade = Grade.objects.get(employee__email=self.employee_data.email)
        activity = Activity.objects.create(grade=grade, name='delete activity')
        activity.save()
        self.assertTrue(Activity.objects.contains(activity))

        response = self.client.delete(reverse('activity-detail', args=[activity.id]))

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Activity.objects.contains(activity))

    def test_Employee_CanSubmitActivityToReview(self):
        login_user(self.client, self.employee_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.IN_WORK.value).first()
        data = {'employeeReport': 'report'}

        response = self.client.patch(reverse('activity-to-review', args=[activity.id]), data,
                                     content_type='application/json')

        self.assertEqual(response.status_code, 200)
        activity.refresh_from_db()
        self.assertEqual(activity.status, ActivityStatus.ON_REVIEW.value)

    def test_Manager_CanReturnActivityFromReview(self):
        login_user(self.client, self.manager_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.IN_WORK.value).first()
        activity.to_review()

        response = self.client.patch(reverse('activity-return', args=[activity.id]))

        self.assertEqual(response.status_code, 200)
        activity.refresh_from_db()
        self.assertEqual(activity.status, ActivityStatus.RETURNED.value)

    def test_Manager_CanCompleteActivity(self):
        login_user(self.client, self.manager_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.IN_WORK.value).first()
        activity.to_review()

        response = self.client.patch(reverse('activity-complete', args=[activity.id]))

        self.assertEqual(response.status_code, 200)
        activity.refresh_from_db()
        self.assertEqual(activity.status, ActivityStatus.COMPLETED.value)

    def test_Manger_CanCancelActivity(self):
        login_user(self.client, self.manager_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.IN_WORK.value).first()
        activity.to_review()

        response = self.client.patch(reverse('activity-cancel', args=[activity.id]))

        self.assertEqual(response.status_code, 200)
        activity.refresh_from_db()
        self.assertEqual(activity.status, ActivityStatus.CANCELED.value)

    def test_Manager_CanReceive_OnReviewActivitiesList(self):
        login_user(self.client, self.manager_data)
        db_activities = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                                status=ActivityStatus.ON_REVIEW.value)
        self.assertNotEqual(len(db_activities), 0)

        response = self.client.get(reverse('activity-list-on-review'))

        self.assertEqual(response.status_code, 200)
        activities: list[dict] = json.loads(*response)
        for activity in activities:
            db_activity = db_activities.get(id=activity['id'])
            self.assertDictEqual(activity, get_activity_on_review_serialized_dict(db_activity))

    def test_NotificationSends_WhenActivitySubmitToReview(self):
        notifications = Notification.objects.filter(owner__email=self.manager_data.email)
        notifications_before = len(notifications)

        login_user(self.client, self.employee_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.IN_WORK.value).first()
        self.client.patch(reverse('activity-to-review', args=[activity.id]))

        self.assertEqual(notifications_before, len(notifications.all()) - 1)
        notification = notifications.latest('notify_time')
        expected_data = {
            'employeeId': User.objects.get(email=self.employee_data.email).id,
            'activityId': activity.id
        }
        self.assertEqual(notification.type, 'ACTIVITY-TO-REVIEW')
        self.assertDictEqual(notification.value, expected_data)

    def test_NotificationSends_WhenMadeActivityReviewDecision(self):
        notifications = Notification.objects.filter(owner__email=self.employee_data.email)
        notifications_before = len(notifications)

        login_user(self.client, self.manager_data)
        activity = Activity.objects.filter(grade__employee__email=self.employee_data.email,
                                           status=ActivityStatus.ON_REVIEW.value).first()
        self.client.patch(reverse('activity-return', args=[activity.id]))

        self.assertEqual(notifications_before, len(notifications.all()) - 1)
        notification = notifications.latest('notify_time')
        expected_data = {
            'managerId': User.objects.get(email=self.manager_data.email).id,
            'activityId': activity.id,
            'decision': 'returned'
        }
        self.assertEqual(notification.type, 'ACTIVITY-REVIEW-DECISION')
        self.assertDictEqual(notification.value, expected_data)

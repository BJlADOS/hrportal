from datetime import datetime

from django.test import TestCase

from .shared_test_logic import *
from ..models import Grade, Activity


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

        manager = User.objects.create_user(**cls.manager_data.__dict__)

        department = create_department(manager)
        employee.current_department = department
        employee.save()

    def setUp(self):
        self.client = Client()

    def test_Employee_CanReceive_YourActivity(self):
        pass

    def test_Manager_CanReceive_EmployeeActivity(self):
        pass

    def test_Manager_CanCreate_Activity(self):
        pass

    def test_Manager_CanPatch_Activity(self):
        pass

    def test_Manager_CanDelete_Activity(self):
        pass

    def test_Employee_CanSubmitActivityToReview(self):
        pass

    def test_Manager_CanReturnActivityFromReview(self):
        pass

    def test_Manager_CanCompleteActivity(self):
        pass

    def test_Manger_CanCancelActivity(self):
        pass

    def test_Manager_CanReceive_OnReviewActivitiesList(self):
        pass

    def test_NotificationSends_WhenActivitySubmitToReview(self):
        pass

    def test_NotificationSends_WhenMadeActivityReviewDecision(self):
        pass

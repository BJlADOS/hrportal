import json
from datetime import datetime

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..models import Grade


class GradesTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)

        grade = Grade.objects.create(employee=employee, name='grade', expiration_date=datetime.now())
        grade.save()

        manager = User.objects.create_user(**cls.manager_data.__dict__)

        department = create_department(manager)
        employee.current_department = department
        employee.save()

    def setUp(self):
        self.client = Client()

    def test_Employee_CanReceive_YourGradesList(self):
        login_user(self.client, self.employee_data)
        employee = User.objects.get(email=self.employee_data.email)

        response = self.client.get(reverse('user-grade-list', args=[employee.id]))

        self.assertEqual(response.status_code, 200)
        grades: list[dict] = json.loads(*response)
        self.assertNotEqual(len(grades), 0)
        for grade in grades:
            db_grade = Grade.objects.get(id=grade['id'])
            self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Employee_CanReceive_YourGrade(self):
        login_user(self.client, self.employee_data)
        db_grade = Grade.objects.filter(employee__email=self.employee_data.email).first()

        response = self.client.get(reverse('grade-detail', args=[db_grade.id]))

        self.assertEqual(response.status_code, 200)
        grade: dict = json.loads(*response)
        self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Manager_CanReceive_EmployeeGradesList(self):
        login_user(self.client, self.manager_data)
        employee = User.objects.get(email=self.employee_data.email)

        response = self.client.get(reverse('user-grade-list', args=[employee.id]))

        self.assertEqual(response.status_code, 200)
        grades: list[dict] = json.loads(*response)
        self.assertNotEqual(len(grades), 0)
        for grade in grades:
            db_grade = Grade.objects.get(id=grade['id'])
            self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Manager_CanReceive_EmployeeGrade(self):
        login_user(self.client, self.manager_data)
        db_grade = Grade.objects.filter(employee__email=self.employee_data.email).first()

        response = self.client.get(reverse('grade-detail', args=[db_grade.id]))

        self.assertEqual(response.status_code, 200)
        grade: dict = json.loads(*response)
        self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Manager_CanCreate_BlankGrade(self):
        login_user(self.client, self.manager_data)
        employee = User.objects.get(email=self.employee_data.email)
        data = {
            "name": "blank grade",
            "employeeId": employee.id,
            "expirationDate": int(datetime.now().timestamp()) * 1000,
            "activities": []
        }

        response = self.client.post(reverse('grade-list'), data, content_type='application/json')

        self.assertEqual(response.status_code, 201)
        grade: dict = json.loads(*response)
        db_grade = Grade.objects.get(id=grade['id'])
        self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Manager_CanCreate_GradeWithActivities(self):
        login_user(self.client, self.manager_data)
        employee = User.objects.get(email=self.employee_data.email)
        data = {
            "name": "blank grade",
            "employeeId": employee.id,
            "expirationDate": int(datetime.now().timestamp()) * 1000,
            "activities": [
                {
                    "name": "activity",
                    "description": "description"
                }
            ]
        }

        response = self.client.post(reverse('grade-list'), data, content_type='application/json')

        self.assertEqual(response.status_code, 201)
        grade: dict = json.loads(*response)
        db_grade = Grade.objects.get(id=grade['id'])
        self.assertDictEqual(grade, get_grade_serialized_dict(db_grade))

    def test_Manager_CanPatch_Grade(self):
        login_user(self.client, self.manager_data)
        db_grade = Grade.objects.filter(employee__email=self.employee_data.email).first()
        data = {
            "name": "new grade name",
            "expirationDate": int(datetime.now().timestamp() + 1000) * 1000
        }

        response = self.client.patch(reverse('grade-detail', args=[db_grade.id]), data,
                                     content_type='application/json')

        self.assertEqual(response.status_code, 200)
        grade: dict = json.loads(*response)
        grade_before = get_grade_serialized_dict(db_grade)
        db_grade.refresh_from_db()
        grade_after = get_grade_serialized_dict(db_grade)
        self.assertDictEqual(grade, grade_after)
        self.assertNotEqual(grade_before, grade_after)
        grade_before['name'] = grade_after['name']
        grade_before['expirationDate'] = grade_after['expirationDate']
        self.assertDictEqual(grade_before, grade_after)

    def test_Manager_CanDelete_Grade(self):
        login_user(self.client, self.manager_data)
        employee = User.objects.get(email=self.employee_data.email)
        grade = Grade.objects.create(employee=employee, name='delete grade', expiration_date=datetime.now())
        grade.save()
        self.assertTrue(Grade.objects.contains(grade))

        response = self.client.delete(reverse('grade-detail', args=[grade.id]))

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Grade.objects.contains(grade))

    def test_Manager_CanComplete_Grade(self):
        login_user(self.client, self.manager_data)
        grade = Grade.objects.filter(employee__email=self.employee_data.email).first()
        self.assertEqual(grade.in_work, True)

        response = self.client.patch(reverse('grade-complete', args=[grade.id]))

        self.assertEqual(response.status_code, 200)
        grade.refresh_from_db()
        self.assertEqual(grade.in_work, False)

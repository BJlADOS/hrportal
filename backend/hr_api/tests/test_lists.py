import itertools
import json
import time

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, Client

from .test_reg_auth import UserData
from ..serializers import *


class PaginationPage:
    def __init__(self, response):
        data = json.loads(*response)
        self.count = data['count']
        self.results = [d['id'] for d in data['results']]


def to_id_list(response):
    data = json.loads(*response)
    return [el['id'] for el in data]


class ListsTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager', 'manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @staticmethod
    def create_vacancy(department, salary, employment, schedule, skills):
        vacancy = Vacancy.objects.create(department=department,
                                         salary=salary,
                                         position='position',
                                         employment=employment,
                                         schedule=schedule,
                                         is_active=True)
        vacancy.required_skills.add(*skills)
        vacancy.save()

    @staticmethod
    def create_resume(user, salary, employment, schedule):
        Resume.objects.create(employee=user,
                              desired_salary=salary,
                              desired_position='position',
                              desired_employment=employment,
                              desired_schedule=schedule,
                              resume=SimpleUploadedFile('resume', b'resume'),
                              is_active=True).save()

    @staticmethod
    def create_skill():
        resume = Skill.objects.create(name='name')
        resume.save()
        return resume

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        admin = User.objects.create_superuser(**cls.admin_data.__dict__)

        department = Department.objects.create(name='department', manager=manager)
        department.save()

        skills = [cls.create_skill(), cls.create_skill(), cls.create_skill()]

        cls.create_vacancy(department, 10000, 'PART', 'FLEX', skills[:1])
        time.sleep(0.1)
        cls.create_vacancy(department, 15000, 'FULL', 'SHIFT', skills[:2])
        time.sleep(0.1)
        cls.create_vacancy(department, 20000, 'FULL', 'FULL', skills)

        cls.create_resume(employee, 10000, 'PART', 'FLEX')
        cls.create_resume(manager, 15000, 'FULL', 'SHIFT')
        cls.create_resume(admin, 20000, 'FULL', 'FULL')

        employee.existing_skills.add(*skills[:1])
        time.sleep(0.1)
        manager.existing_skills.add(*skills[:2])
        time.sleep(0.1)
        admin.existing_skills.add(*skills)

    def setUp(self):
        self.client = Client()
        self.client.post('/login/', {'email': self.admin_data.email, 'password': self.admin_data.password})

    filter_test_cases = {
        '': [1, 2, 3],
        'salary_min=15000': [2, 3],
        'salary_max=15000': [1, 2],
        'salary_min=15000&salary_max=15000': [2],
        'employment=PART': [1],
        'employment=FULL': [2, 3],
        'schedule=DISTANT': [],
        'schedule=FLEX': [1],
        'schedule=SHIFT': [2],
        'schedule=FULL': [3],
        'skills=1': [1, 2, 3],
        'skills=1&skills=2&': [2, 3],
        'skills=1&skills=2&skills=3': [3]
    }

    def test_GetVacanciesWithFilters_ShouldReturnFilteredVacancies(self):
        for path, expected in self.filter_test_cases.items():
            result = to_id_list(self.client.get(f'/vacancies/?{path}'))
            assert result == expected

    def test_GetResumesWithFilters_ShouldReturnFilteredResumes(self):
        for path, expected in self.filter_test_cases.items():
            result = to_id_list(self.client.get(f'/resumes/?{path}'))
            assert result == expected

    sorting_test_cases = {
        '': [1, 2, 3],
        'salary': [1, 2, 3],
        '-salary': [3, 2, 1],
        'time': [1, 2, 3],
        '-time': [3, 2, 1]
    }

    def test_GetVacanciesWithSorting_ShouldReturnSortedVacancies(self):
        for path, expected in self.sorting_test_cases.items():
            result = to_id_list(self.client.get(f'/vacancies/?ordering={path}'))
            assert result == expected

    def test_GetResumesWithSorting_ShouldReturnSortedResumes(self):
        for path, expected in self.sorting_test_cases.items():
            result = to_id_list(self.client.get(f'/resumes/?ordering={path}'))
            assert result == expected

    def test_GetVacanciesWithPagination_ShouldReturnCorrectPage(self):
        cases = [case for case in itertools.product(range(4), repeat=2) if case[0] != 0]
        for limit, offset in cases:
            response = self.client.get(f'/vacancies/?limit={limit}&offset={offset}')
            page = PaginationPage(response)
            assert [1, 2, 3][offset:offset+limit] == page.results

    def test_GetResumesWithPagination_ShouldReturnCorrectPage(self):
        cases = [case for case in itertools.product(range(4), repeat=2) if case[0] != 0]
        for limit, offset in cases:
            response = self.client.get(f'/vacancies/?limit={limit}&offset={offset}')
            page = PaginationPage(response)
            assert [1, 2, 3][offset:offset+limit] == page.results


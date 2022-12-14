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
    def create_vacancy(department, position, salary, employment, schedule, skills):
        vacancy = Vacancy.objects.create(department=department,
                                         position=position,
                                         salary=salary,
                                         employment=employment,
                                         schedule=schedule,
                                         is_active=True)
        vacancy.required_skills.add(*skills)
        vacancy.save()

    @staticmethod
    def create_resume(user, position, salary, employment, schedule):
        Resume.objects.create(employee=user,
                              desired_position=position,
                              desired_salary=salary,
                              desired_employment=employment,
                              desired_schedule=schedule,
                              resume=SimpleUploadedFile('test.pdf', b'resume'),
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

        department1 = Department.objects.create(name='department1', manager=manager)
        department1.save()
        department2 = Department.objects.create(name='department2')
        department2.save()
        department3 = Department.objects.create(name='department3')
        department3.save()
        department4 = Department.objects.create(name='department4')
        department4.save()

        skills = [cls.create_skill(), cls.create_skill(), cls.create_skill()]

        cls.create_vacancy(department2, 'Pos', 10000, 'PART', 'FLEX', skills[:1])
        time.sleep(0.1)
        cls.create_vacancy(department3, 'Posit', 15000, 'FULL', 'SHIFT', skills[:2])
        time.sleep(0.1)
        cls.create_vacancy(department4, 'Position', 20000, 'FULL', 'FULL', skills)

        cls.create_resume(employee, 'Pos', 10000, 'PART', 'FLEX')
        cls.create_resume(manager, 'Posit', 15000, 'FULL', 'SHIFT')
        cls.create_resume(admin, 'Position', 20000, 'FULL', 'FULL')

        employee.existing_skills.add(*skills[:1])
        time.sleep(0.1)
        manager.existing_skills.add(*skills[:2])
        time.sleep(0.1)
        admin.existing_skills.add(*skills)

    def setUp(self):
        self.client = Client()
        self.client.post('/api/login/', {'email': self.admin_data.email, 'password': self.admin_data.password})

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

    vacancies_filter_test_cases = {
        'department=1': [],
        'department=1&department=2': [1],
        'department=1&department=2&department=3': [1, 2],
        'department=1&department=2&department=3&department=4': [1, 2, 3],
        'department=2&department=4': [1, 3]
    }

    def test_GetVacanciesWithFilters_ShouldReturnFilteredVacancies(self):
        for path, expected in (self.filter_test_cases | self.vacancies_filter_test_cases).items():
            response = self.client.get(f'/api/vacancies/?{path}')
            result = to_id_list(response)
            assert sorted(result) == sorted(expected)

    def test_GetResumesWithFilters_ShouldReturnFilteredResumes(self):
        for path, expected in self.filter_test_cases.items():
            result = to_id_list(self.client.get(f'/api/resumes/?{path}'))
            assert sorted(result) == sorted(expected)

    sorting_test_cases = {
        '': [1, 2, 3],
        'salary': [1, 2, 3],
        '-salary': [3, 2, 1],
        'time': [1, 2, 3],
        '-time': [3, 2, 1]
    }

    def test_GetVacanciesWithSorting_ShouldReturnSortedVacancies(self):
        for path, expected in self.sorting_test_cases.items():
            result = to_id_list(self.client.get(f'/api/vacancies/?ordering={path}'))
            assert result == expected

    def test_GetResumesWithSorting_ShouldReturnSortedResumes(self):
        for path, expected in self.sorting_test_cases.items():
            result = to_id_list(self.client.get(f'/api/resumes/?ordering={path}'))
            assert result == expected

    def test_GetVacanciesWithPagination_ShouldReturnCorrectPage(self):
        cases = [case for case in itertools.product(range(4), repeat=2) if case[0] != 0]
        for limit, offset in cases:
            response = self.client.get(f'/api/vacancies/?limit={limit}&offset={offset}')
            page = PaginationPage(response)
            assert [1, 2, 3][offset:offset + limit] == page.results

    def test_GetResumesWithPagination_ShouldReturnCorrectPage(self):
        cases = [case for case in itertools.product(range(4), repeat=2) if case[0] != 0]
        for limit, offset in cases:
            response = self.client.get(f'/api/vacancies/?limit={limit}&offset={offset}')
            page = PaginationPage(response)
            assert [1, 2, 3][offset:offset + limit] == page.results

    searching_test_cases = {
        'Pos': [1, 2, 3],
        'pos': [1, 2, 3],
        'Posit': [2, 3],
        'posit': [2, 3],
        'Position': [3],
        'position': [3],
        'os': [1, 2, 3],
        'sit': [2, 3],
        'tion': [3],
        'NotPosition': []
    }

    def test_GetVacanciesWithSearching_ShouldReturnMatchedVacancies(self):
        for path, expected in self.searching_test_cases.items():
            result = to_id_list(self.client.get(f'/api/vacancies/?search={path}'))
            assert sorted(result) == sorted(expected)

    def test_GetResumesWithSearching_ShouldReturnMatchedResumes(self):
        for path, expected in self.searching_test_cases.items():
            result = to_id_list(self.client.get(f'/api/resumes/?search={path}'))
            assert sorted(result) == sorted(expected)

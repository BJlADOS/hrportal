import json

from django.test import TestCase
from django.urls import reverse

from .shared_test_logic import *
from ..views import *


def to_id_list(response) -> list[int]:
    data = json.loads(*response)
    return [el['id'] for el in data]


class FiltersOrderingsPaginationTests(TestCase):
    employee_data = UserData('employee', 'employee@hrportal.com', 'password')
    manager_data = UserData('manager_not_admin', 'manager@hrportal.com', 'password')
    admin_data = UserData('admin', 'admin@hrportal.com', 'password')

    @classmethod
    def setUpTestData(cls):
        employee = User.objects.create_user(**cls.employee_data.__dict__)
        employee.deactivate()
        employee.experience = '<1'
        employee.save()
        manager = User.objects.create_user(**cls.manager_data.__dict__)
        manager.experience = '1-3'
        manager.save()
        admin = User.objects.create_superuser(**cls.admin_data.__dict__)
        admin.experience = '>6'
        admin.save()
        cls.user_ids = [u.id for u in [employee, manager, admin]]

        dep1 = create_department(manager)
        dep2 = create_department()
        dep3 = create_department()
        dep4 = create_department()
        departments = [dep1, dep2, dep3, dep4]
        cls.dep_ids = [dep.id for dep in departments]

        skills = [
            create_skill(),
            create_skill(),
            create_skill()
        ]
        skills_ids = [skill.id for skill in skills]
        cls.skills_ids = skills_ids

        vacancies = [
            create_vacancy_for(dep2, create_vacancy_data('Pos', 10000, 'PART', 'FLEX',
                                                         'desc', skills_ids[:1], 'PUBLIC')),
            create_vacancy_for(dep3, create_vacancy_data('Posit', 15000, 'FULL', 'SHIFT',
                                                         'desc', skills_ids[:2], 'ARCHIVED')),
            create_vacancy_for(dep4, create_vacancy_data('Position', 20000, 'FULL', 'FULL',
                                                         'desc', skills_ids, 'DELETED'))]
        cls.vac_ids = [vac.id for vac in vacancies]

        resumes = [
            create_resume_for(employee, create_resume_data('Pos', 10000, 'PART', 'FLEX', status='PUBLIC')),
            create_resume_for(manager, create_resume_data('Posit', 15000, 'FULL', 'SHIFT', status='ARCHIVED')),
            create_resume_for(admin, create_resume_data('Position', 20000, 'FULL', 'FULL', status='DELETED'))
        ]
        cls.res_ids = [res.id for res in resumes]

        employee.existing_skills.add(*skills[:1])
        manager.existing_skills.add(*skills[:2])
        admin.existing_skills.add(*skills)

    def setUp(self):
        self.client = Client()
        login_user(self.client, self.admin_data)

    def test_GetVacanciesWithFilters_ShouldReturnFilteredVacancies(self):
        ids = self.vac_ids
        sks = self.skills_ids
        dps = self.dep_ids
        test_cases = {
            '': ids,
            'salary_min=15000': ids[1:],
            'salary_max=15000': ids[:2],
            'salary_min=15000&salary_max=15000': ids[1:2],
            'employment=PART': ids[:1],
            'employment=FULL': ids[1:],
            'schedule=DISTANT': [],
            'schedule=FLEX': ids[:1],
            'schedule=SHIFT': ids[1:2],
            'schedule=FULL': ids[2:],
            f'skills={sks[0]}': ids,
            f'skills={sks[0]}&skills={sks[1]}&': ids[1:],
            f'skills={sks[0]}&skills={sks[1]}&skills={sks[2]}': ids[2:],
            f'department={dps[0]}': [],
            f'department={dps[0]}&department={dps[1]}': ids[:1],
            f'department={dps[0]}&department={dps[1]}&department={dps[2]}': ids[:2],
            f'department={dps[0]}&department={dps[1]}&department={dps[2]}&department={dps[3]}': ids,
            f'department={dps[1]}&department={dps[3]}': ids[:1] + ids[2:],
            'status=PUBLIC': ids[:1],
            'status=ARCHIVED': ids[1:2],
            'status=DELETED': ids[2:],
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(reverse('vacancy-list') + f'?{path}'))
            self.assertListEqual(sorted(result), sorted(expected))

    def test_GetResumesWithFilters_ShouldReturnFilteredResumes(self):
        ids = self.res_ids
        sks = self.skills_ids
        test_cases = {
            '': ids,
            'salary_min=15000': ids[1:],
            'salary_max=15000': ids[:2],
            'salary_min=15000&salary_max=15000': ids[1:2],
            'employment=PART': ids[:1],
            'employment=FULL': ids[1:],
            'schedule=DISTANT': [],
            'schedule=FLEX': ids[:1],
            'schedule=SHIFT': ids[1:2],
            'schedule=FULL': ids[2:],
            f'skills={sks[0]}': ids,
            f'skills={sks[0]}&skills={sks[1]}&': ids[1:],
            f'skills={sks[0]}&skills={sks[1]}&skills={sks[2]}': ids[2:],
            'status=PUBLIC': ids[:1],
            'status=ARCHIVED': ids[1:2],
            'status=DELETED': ids[2:],
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(reverse('resume-list') + f'?{path}'))
            self.assertListEqual(sorted(result), sorted(expected))

    def test_GetUsersWithFilters_ShouldReturnFilteredUsers(self):
        ids = self.user_ids
        test_cases = {
            '': ids,
            f'department={self.dep_ids[0]}': [ids[1]],
            f'department={self.dep_ids[1]}': [],
            f'department={self.dep_ids[0]}&department={self.dep_ids[1]}': [ids[1]],
            'experience=<1': [ids[0]],
            'experience=1-3': [ids[1]],
            'experience=3-6': [],
            'experience=>6': [ids[2]],
            'active=false': [ids[0]],
            'active=true': ids[1:],
            f'skills={self.skills_ids[0]}': ids,
            f'skills={self.skills_ids[1]}': ids[1:],
            f'skills={self.skills_ids[2]}': [ids[2]],
            f'skills={self.skills_ids[0]}&skills={self.skills_ids[1]}': ids[1:],
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(reverse('user-list') + f'?{path}'))
            self.assertListEqual(sorted(result), sorted(expected), msg=f'path - {path}')

    def test_GetVacanciesWithSorting_ShouldReturnSortedVacancies(self):
        ids = self.vac_ids
        test_cases = {
            '': ids,
            'salary': ids,
            '-salary': reversed(ids),
            'time': ids,
            '-time': reversed(ids)
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(reverse('vacancy-list') + f'?ordering={path}'))
            self.assertListEqual(result, list(expected))

    def test_GetResumesWithSorting_ShouldReturnSortedResumes(self):
        ids = self.res_ids
        test_cases = {
            '': ids,
            'salary': ids,
            '-salary': reversed(ids),
            'time': ids,
            '-time': reversed(ids)
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(reverse('resume-list') + f'?ordering={path}'))
            self.assertListEqual(result, list(expected))

    def test_GetVacanciesWithPagination_ShouldReturnCorrectPage(self):
        response = self.client.get(f'{reverse("vacancy-list")}?limit=2&offset=1')
        result: dict = json.loads(*response)
        self.assertTrue("count" in result)
        self.assertTrue("next" in result)
        self.assertTrue("previous" in result)
        self.assertTrue("results" in result)

    def test_GetResumesWithPagination_ShouldReturnCorrectPage(self):
        response = self.client.get(f'{reverse("resume-list")}?limit=2&offset=1')
        result: dict = json.loads(*response)
        self.assertTrue("count" in result)
        self.assertTrue("next" in result)
        self.assertTrue("previous" in result)
        self.assertTrue("results" in result)

    def test_GetUsersWithPagination_ShouldReturnCorrectPage(self):
        response = self.client.get(f'{reverse("user-list")}?limit=2&offset=1')
        result: dict = json.loads(*response)
        self.assertTrue("count" in result)
        self.assertTrue("next" in result)
        self.assertTrue("previous" in result)
        self.assertTrue("results" in result)

    def test_GetNotificationsWithPagination_ShouldReturnCorrectPage(self):
        response = self.client.get(f'{reverse("notification-list")}?limit=2&offset=1')
        result: dict = json.loads(*response)
        self.assertTrue("count" in result)
        self.assertTrue("next" in result)
        self.assertTrue("previous" in result)
        self.assertTrue("results" in result)

    def test_GetVacanciesWithSearching_ShouldReturnMatchedVacancies(self):
        ids = self.vac_ids
        test_cases = {
            'Pos': ids,
            'pos': ids,
            'Posit': ids[1:],
            'posit': ids[1:],
            'Position': ids[2:],
            'position': ids[2:],
            'os': ids,
            'sit': ids[1:],
            'tion': ids[2:],
            'NotPosition': []
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(f'{reverse("vacancy-list")}?search={path}'))
            self.assertListEqual(sorted(result), sorted(expected))

    def test_GetResumesWithSearching_ShouldReturnMatchedResumes(self):
        ids = self.res_ids
        test_cases = {
            'Pos': ids,
            'pos': ids,
            'Posit': ids[1:],
            'posit': ids[1:],
            'Position': ids[2:],
            'position': ids[2:],
            'os': ids,
            'sit': ids[1:],
            'tion': ids[2:],
            'NotPosition': []
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(f'{reverse("resume-list")}?search={path}'))
            self.assertListEqual(sorted(result), sorted(expected))

    def test_GetUsersWithSearching_ShouldReturnMatchedUsers(self):
        ids = self.user_ids
        test_cases = {
            '@hrportal.com': ids,
            'admin': ids[1:],
            'manager': [ids[1]],
            'admin@hrp': [ids[2]],
            'manager@hrp': [ids[1]],
            'employee@hrp': [ids[0]]
        }
        for path, expected in test_cases.items():
            result = to_id_list(self.client.get(f'{reverse("user-list")}?search={path}'))
            self.assertListEqual(sorted(result), sorted(expected))

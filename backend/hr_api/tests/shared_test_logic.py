from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client

from ..models import User, Resume, Vacancy, Department, Skill


class UserData:
    def __init__(self, fullname, email, password):
        self.fullname = fullname
        self.email = email
        self.password = password


def login_user(client: Client, user_data: UserData) -> None:
    login_data = {'email': user_data.email, 'password': user_data.password}
    client.post('/api/login/', login_data)


def create_resume_for(user: User, data: dict) -> Resume:
    resume = Resume.objects.create(employee=user,
                                   desired_position=data['desiredPosition'],
                                   desired_salary=data['desiredSalary'],
                                   desired_employment=data['desiredEmployment'],
                                   desired_schedule=data['desiredSchedule'],
                                   resume=data['resume'],
                                   status=data['status'])
    resume.save()
    return resume


default_resume_data = {
    'desiredPosition': 'position',
    'desiredSalary': 0,
    'desiredEmployment': 'PART',
    'desiredSchedule': 'DISTANT',
    'resume': SimpleUploadedFile('test.pdf', b'resume'),
    'status': 'PUBLIC'
}


def get_resume_serialized_dict(resume: Resume) -> dict:
    return {
        'id': resume.id,
        'employeeId': None if resume.employee is None else resume.employee.id,
        'desiredPosition': resume.desired_position,
        'desiredSalary': resume.desired_salary,
        'desiredEmployment': resume.desired_employment,
        'desiredSchedule': resume.desired_schedule,
        'resume': resume.resume.url,
        'status': resume.status,
        'createdAt': int(resume.created_at.timestamp()) * 1000,
        'modifiedAt': int(resume.modified_at.timestamp()) * 1000
    }


def create_vacancy_for(department: Department, data: dict) -> Vacancy:
    vacancy = Vacancy.objects.create(
        department=department,
        position=data['position'],
        salary=data['salary'],
        employment=data['employment'],
        schedule=data['schedule'],
        description=data['description'],
        status=data['status']
    )

    for skill_id in data['requiredSkillsIds']:
        vacancy.required_skills.add(Skill.objects.get(id=skill_id))

    vacancy.save()
    return vacancy


default_vacancy_data = {
    'position': 'position',
    'salary': 0,
    'employment': 'PART',
    'schedule': 'DISTANT',
    'description': 'description',
    'requiredSkillsIds': [1, 2, 3],
    'status': 'PUBLIC'
}


def get_vacancy_serialized_dict(vacancy: Vacancy) -> dict:
    return {
        'id': vacancy.id,
        'department': None if vacancy.department is None else {
            'id': vacancy.department.id,
            'name': vacancy.department.name,
            'managerId': vacancy.department.manager.id
        },
        'position': vacancy.position,
        'salary': vacancy.salary,
        'employment': vacancy.employment,
        'schedule': vacancy.schedule,
        'description': vacancy.description,
        'status': vacancy.status,
        'requiredSkills': [{'id': skill.id, 'name': skill.name} for skill in vacancy.required_skills.all()],
        'createdAt': int(vacancy.created_at.timestamp()) * 1000,
        'modifiedAt': int(vacancy.modified_at.timestamp()) * 1000
    }

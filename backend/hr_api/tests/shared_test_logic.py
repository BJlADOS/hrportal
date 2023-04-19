from django.conf import settings
from django.core.files import File
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


def create_resume_data(
        desired_position: str = 'position',
        desired_salary: int = 0,
        desired_employment: str = 'PART',
        desired_schedule: str = 'DISTANT',
        resume: File = SimpleUploadedFile('test.pdf', b'resume'),
        status: str = 'PUBLIC'
) -> dict:
    return {
        'desiredPosition': desired_position,
        'desiredSalary': desired_salary,
        'desiredEmployment': desired_employment,
        'desiredSchedule': desired_schedule,
        'resume': resume,
        'status': status
    }


default_resume_data = create_resume_data()


def get_resume_serialized_dict(resume: Resume) -> dict:
    return {
        'id': resume.id,
        'employeeId': None if resume.employee is None else resume.employee.id,
        'desiredPosition': resume.desired_position,
        'desiredSalary': resume.desired_salary,
        'desiredEmployment': resume.desired_employment,
        'desiredSchedule': resume.desired_schedule,
        'resume': resume.resume.url[len(settings.MEDIA_URL):],
        'status': resume.status,
        'createdAt': int(resume.created_at.timestamp()) * 1000,
        'modifiedAt': int(resume.modified_at.timestamp()) * 1000
    }


def create_vacancy_for(department: Department, data: dict, add_skills_ids=None) -> Vacancy:
    if add_skills_ids is None:
        add_skills_ids = list()

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

    for skill_id in add_skills_ids:
        vacancy.required_skills.add(Skill.objects.get(id=skill_id))

    vacancy.save()
    return vacancy


def create_vacancy_data(
        position: str = 'position',
        salary: int = 0,
        employment: str = 'PART',
        schedule: str = 'DISTANT',
        description: str = 'description',
        required_skills_ids: list[int] = None,
        status: str = 'PUBLIC') -> dict:
    if required_skills_ids is None:
        required_skills_ids = list()
    return {
        'position': position,
        'salary': salary,
        'employment': employment,
        'schedule': schedule,
        'description': description,
        'requiredSkillsIds': required_skills_ids,
        'status': status
    }


default_vacancy_data = create_vacancy_data()


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


def create_skill() -> Skill:
    skill = Skill.objects.create(name='name')
    skill.save()
    return skill


def create_department(manager: User = None) -> Department:
    dep = Department.objects.create(name="department", manager=manager)
    dep.save()
    return dep


def get_user_serialized_dict(user: User) -> dict:
    return {
        "id": user.id,
        "fullname": user.fullname,
        "email": user.email,
        "contact": user.contact,
        "experience": user.experience,
        "currentDepartment": None if user.current_department is None else {
            "id": user.current_department.id,
            "name": user.current_department.name,
            "managerId": user.current_department.manager.id
        },
        "photo": None if not user.photo else user.photo.url[len(settings.MEDIA_URL):],
        "existingSkills": [{"id": skill.id, "name": skill.name} for skill in user.existing_skills.all()],
        "filled": user.filled,
        "isManager": user.is_manager,
        "isAdmin": user.is_admin,
        "emailVerified": user.email_verified,
        "isActive": user.is_active
    }

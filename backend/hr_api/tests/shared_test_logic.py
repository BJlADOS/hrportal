from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client

from ..models import User, Resume


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
        'employeeId': resume.employee.id,
        'desiredPosition': resume.desired_position,
        'desiredSalary': resume.desired_salary,
        'desiredEmployment': resume.desired_employment,
        'desiredSchedule': resume.desired_schedule,
        'resume': resume.resume.url,
        'status': resume.status,
        'createdAt': int(resume.created_at.timestamp()) * 1000,
        'modifiedAt': int(resume.modified_at.timestamp()) * 1000
    }

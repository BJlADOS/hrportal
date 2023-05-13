from django.db import models

from .resume import Resume
from .user import User
from .vacancy import Vacancy

NOTIFICATION_CHOICES = [
    ('RESUME-RESPONSE', 'Отклик на резюме'),
    ('VACANCY-RESPONSE', 'Отклик на вакансию')
]


class Notification(models.Model):
    owner = models.ForeignKey(to=User, on_delete=models.CASCADE)
    type = models.CharField(max_length=255, choices=NOTIFICATION_CHOICES)
    value = models.JSONField()
    read = models.BooleanField(default=False)
    notify_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Notification({self.type}, {self.owner})'

    @staticmethod
    def resume_response(resume: Resume, manager: User):
        Notification(
            owner=resume.employee,
            type=NOTIFICATION_CHOICES[0][0],
            value={
                'manager': manager.id,
                'department': manager.department.id,
                'employee': resume.employee.id
            }
        ).save()

    @staticmethod
    def vacancy_response(vacancy: Vacancy, manager: User, employee: User, pdf_resume):
        Notification(
            owner=manager,
            type=NOTIFICATION_CHOICES[1][0],
            value={
                'employee': employee.id,
                'department': vacancy.department.id,
                'vacancy': vacancy.id,
                'resume': 'url' # TODO получать url
            }
        ).save()

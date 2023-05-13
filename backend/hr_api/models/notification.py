from django.db import models

from .user import User

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

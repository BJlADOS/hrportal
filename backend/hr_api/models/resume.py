from django.db import models

from .shared import *


class Resume(models.Model):
    employee = models.ForeignKey(to='User', on_delete=models.SET_NULL, null=True)

    desired_position = models.CharField(max_length=255)

    desired_salary = models.IntegerField()

    desired_employment = models.CharField(max_length=4, choices=EMPLOYMENT_CHOICES)

    desired_schedule = models.CharField(max_length=7, choices=SCHEDULE_CHOICES)

    resume = models.FileField(upload_to=get_upload_path)

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default=STATUS_CHOICES[0][0])

    modified_at = models.DateTimeField(auto_now=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def publish(self):
        self.status = 'PUBLIC'
        self.save()

    def archive(self):
        self.status = 'ARCHIVED'
        self.save()

    def soft_delete(self):
        self.status = 'DELETED'
        self.save()

    def __str__(self):
        return f"Resume({self.desired_position}, {self.employee.fullname})"

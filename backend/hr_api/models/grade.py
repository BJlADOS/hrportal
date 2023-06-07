from django.db import models

from .user import User


class Grade(models.Model):
    employee = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    in_work = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(default=False)

    def complete(self):
        self.in_work = False
        self.save()

    def __str__(self):
        return f"Grade({self.id}, {self.name})"

    @property
    def department(self):
        return self.employee.department

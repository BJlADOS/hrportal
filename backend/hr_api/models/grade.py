from django.db import models

from .user import User


class Grade(models.Model):
    employee = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    in_work = models.BooleanField(default=True)
    expiration_date = models.DateTimeField(default=False)

    def complete(self) -> bool:
        if any([not activity.is_finalized for activity in self.activity_set.all()]):
            return False
        self.in_work = False
        self.save()
        return True

    def __str__(self):
        return f"Grade({self.id}, {self.name})"

    @property
    def department(self):
        return self.employee.department

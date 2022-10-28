from django.db import models

from jwt_auth.models import User


class Department(models.Model):
    name = models.CharField(max_length=255)
    manager = models.OneToOneField(to=User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"Skill({self.name})"

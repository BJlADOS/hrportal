from django.db import models
from django.db.models.signals import post_save


class Department(models.Model):
    name = models.CharField(max_length=255)

    manager = models.OneToOneField(to='User', on_delete=models.SET_NULL, null=True, blank=True)

    @staticmethod
    def change_manager_department(sender, instance, created, **kwargs):
        if instance.manager is not None:
            instance.manager.current_department = instance
            instance.manager.save()

    def __str__(self):
        return f"Department({self.name})"


post_save.connect(Department.change_manager_department, sender=Department)

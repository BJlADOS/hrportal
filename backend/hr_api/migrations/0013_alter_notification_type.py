# Generated by Django 4.2 on 2023-05-13 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hr_api', '0012_notification'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('RESUME-RESPONSE', 'Отклик на резюме'), ('VACANCY-RESPONSE', 'Отклик на вакансию')], max_length=255),
        ),
    ]
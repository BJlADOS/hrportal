# Generated by Django 4.2 on 2023-05-14 06:10

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hr_api', '0014_pdfresume_remove_resume_id_remove_resume_resume_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='resume',
            name='employee',
        ),
        migrations.AddField(
            model_name='pdfresume',
            name='employee',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]

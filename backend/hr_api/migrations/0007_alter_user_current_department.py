# Generated by Django 4.1.2 on 2022-11-23 05:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hr_api', '0006_alter_vacancy_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='current_department',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='hr_api.department'),
        ),
    ]

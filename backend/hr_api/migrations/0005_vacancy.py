# Generated by Django 4.1.2 on 2022-10-31 09:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hr_api', '0004_resume'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vacancy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.CharField(max_length=255)),
                ('salary', models.IntegerField()),
                ('employment', models.CharField(choices=[('PART', 'Частичная занятость'), ('FULL', 'Полная занятость')], max_length=4)),
                ('schedule', models.CharField(choices=[('DISTANT', 'Удаленная работа'), ('FLEX', 'Гибкий график'), ('SHIFT', 'Сменный график'), ('FULL', 'Полная работа')], max_length=7)),
                ('description', models.TextField()),
                ('is_active', models.BooleanField()),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('department', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hr_api.department')),
                ('required_skills', models.ManyToManyField(blank=True, to='hr_api.skill')),
            ],
            options={
                'verbose_name_plural': 'Vacancies',
            },
        ),
    ]

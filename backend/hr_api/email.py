from django.core.mail import send_mail, EmailMessage

from .authentication import *
from .models import *


def send_verification_email(user):
    subject = 'Подтверждение адреса электронной почты на HR-портале "Очень Интересно"'

    def verification_message(url):
        return f'Для подтверждения адреса электронной почты перейдите по {url}' \
               f'Если вы не регистрировались на HR-портале "Очень Интересно" ' \
               f'- не переходите по ссылке, а свяжитесь сс службой поддержки портала.'

    verification_url = settings.VERIFICATION_URL + f'?code={create_user_token(user)}'
    plain_url = f'ссылке: {verification_url}\n\n'
    html_url = f'<a href="{verification_url}">ссылке.</a><br><br>'
    result = send_mail(subject, verification_message(plain_url), None, [user.email],
                       html_message=verification_message(html_url))
    result_message = f'Email verification mail to User(ID={user.id}) sending '
    result_message += 'successful' if bool(result) else 'failed'
    return result_message


def send_password_recovery_email(user):
    subject = 'Восстановление пароля на HR-портале "Очень Интересно"'

    def verification_message(url):
        return f'Для восстановления пароля перейдите по {url}' \
               f'Если вы не пытались восстановить пароль на HR-портале "Очень Интересно" ' \
               f'- не переходите по ссылке, а свяжитесь сс службой поддержки портала.'

    recovery_url = settings.RECOVERY_URL + f'?code={create_user_token(user)}'
    plain_url = f'ссылке: {recovery_url}\n\n'
    html_url = f'<a href="{recovery_url}">ссылке.</a><br><br>'
    result = send_mail(subject, verification_message(plain_url), None, [user.email],
                       html_message=verification_message(html_url))
    result_message = f'Email verification mail to User(ID={user.id}) sending '
    result_message += 'successful' if bool(result) else 'failed'
    return result_message


def send_resume_response(resume: Resume, manager: User):
    subject = 'Отклик на ваше резюме на HR-портале "Очень Интересно"'
    message = f'Уважаемый {resume.employee.fullname}!\n\n' \
              f'На ваше резюме на должность "{resume.desired_position}" ' \
              f'получен отклик от руководителя отдела "{manager.department.name}".\n\n' \
              f'Контакты для связи:\n' \
              f'ФИО - {manager.fullname}\n' \
              f'Email - {manager.email}'
    message += f'\nДополнительный контакт: {manager.contact}' if manager.contact else ''
    result = send_mail(subject, message, None, [resume.employee.email])
    result_message = f'Response from Manager(ID={manager.id}) to Employee(ID={resume.employee.id}) '
    result_message += 'successful' if bool(result) else 'failed'
    return result_message


def send_vacancy_response(employee: User, manager: User, vacancy: Vacancy, pdf_resume):
    subject = 'Отклик на вакансию вашего отдела на HR-портале "Очень Интересно"'
    message = f'Уважаемый {manager.fullname}!\n\n' \
              f'На ваше вакансию на должность "{vacancy.position}" получен отклик\n\n' \
              f'Контакты для связи:\n' \
              f'ФИО - {employee.fullname}\n' \
              f'Email - {employee.email}'
    message += f'\nДополнительный контакт: {employee.contact}' if employee.contact else ''
    message += f'\n\nРезюме сотрудника приложено к письму'
    mail = EmailMessage(subject, message, None, [manager.email])
    mail.attach("resume.pdf", pdf_resume.read())
    result = mail.send()
    result_message = f'Response from Employee(ID={employee.id}) to Manager(ID={manager.id}) '
    result_message += 'successful' if bool(result) else 'failed'
    return result_message

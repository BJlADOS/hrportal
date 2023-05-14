from django.core.files import File
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template

from .authentication import *
from .models import *


def send_mail_with(
        subject: str,
        plain_template,
        html_template,
        context: dict,
        to: list[str],
        mail_name: str,
        attachments: list[(str, File)] = None
) -> str:
    plaintext = plain_template.render(context)
    html = html_template.render(context)
    mail = EmailMultiAlternatives(subject, plaintext, None, to)
    mail.attach_alternative(html, "text/html")
    if not attachments is None:
        for attachment in attachments:
            mail.attach(attachment[0], attachment[1].read())
    result = mail.send()

    return mail_name + ' sending ' + 'successful' if bool(result) else 'failed'


def send_email_verification_mail(user: User):
    return send_mail_with(
        'Подтверждение адреса электронной почты на HR-портале "Очень Интересно"',
        get_template('verification.txt'),
        get_template('verification.html'),
        {'url': settings.VERIFICATION_URL + f'?code={create_user_token(user)}'},
        [user.email],
        f'Email verification mail to User(ID={user.id})'
    )


def send_change_password_mail(user: User):
    return send_mail_with(
        'Смена (восстановление) пароля на HR-портале "Очень Интересно"',
        get_template('change-password.txt'),
        get_template('change-password.html'),
        {'url': settings.SET_PASSWORD_URL + f'?code={create_user_token(user)}'},
        [user.email],
        f'Change password mail to User(ID={user.id})'
    )


def send_resume_response(resume: Resume, manager: User):
    return send_mail_with(
        'Отклик на ваше резюме на HR-портале "Очень Интересно"',
        get_template('resume-response.txt'),
        get_template('resume-response.html'),
        {'resume': resume, 'manager': manager},
        [resume.employee.email],
        f'Response from Manager(ID={manager.id}) to Employee(ID={resume.employee.id}) mail'
    )


def send_vacancy_response(employee: User, manager: User, vacancy: Vacancy, pdf_resume: PDFResume):
    return send_mail_with(
        'Отклик на вакансию вашего отдела на HR-портале "Очень Интересно"',
        get_template('vacancy-response.txt'),
        get_template('vacancy-response.html'),
        {'employee': employee, 'manager': manager, 'vacancy': vacancy},
        [manager.email],
        f'Response from Employee(ID={employee.id}) to Manager(ID={manager.id}) mail',
        [('resume.pdf', pdf_resume.file)]
    )

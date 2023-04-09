from django.core.mail import send_mail

from .authentication import *


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

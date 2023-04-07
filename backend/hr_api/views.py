from django.contrib.auth import authenticate
from django.core.mail import send_mail, EmailMessage
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, exceptions, generics
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .authentication import JWTAuthentication
from .filters import *
from .permissions import IsManagerUser
from .serializers import *
from .tokens import *


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def registration_view(request):
    serializer = RegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    result = send_verification_email(user)

    return response_with_detail(result, status.HTTP_201_CREATED)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def verification_view(request):
    serializer = CodeSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = get_token_user(serializer.data['code'])

    if user is None:
        return response_with_detail('Invalid verification code.', status.HTTP_401_UNAUTHORIZED)

    user.email_verified = True
    user.save()

    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def password_recovery_request_view(request):
    serializer = EmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        user = User.objects.get(email=serializer.data['email'])
        send_password_recovery_email(user)
    except User.DoesNotExist:
        pass

    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def password_recovery_view(request):
    serializer = RecoverySerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = get_token_user(serializer.data['code'])

    if user is None:
        return response_with_detail('Invalid verification code.', status.HTTP_401_UNAUTHORIZED)

    user.set_password(serializer.data['password'])
    user.save()

    return Response(status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    serializer = AuthSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = authenticate(username=request.data['email'], password=request.data['password'])

    if user is None:
        return response_with_detail('A user with this email and password was not found.',
                                    status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return response_with_detail('This user has been deactivated.', status.HTTP_401_UNAUTHORIZED)

    add_auth(request, user)

    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def logout_view(request):
    request.session.flush()
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def authorized_view(request):
    result = False
    try:
        auth_result = JWTAuthentication().authenticate(request)
        if auth_result is not None:
            result = True
    except exceptions.AuthenticationFailed:
        pass
    return Response({'authorized': result}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def unique_email_view(request):
    serializer = EmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    result = True
    try:
        User.objects.get(email=serializer.data['email'])
        result = False
    except User.DoesNotExist:
        pass
    return Response({'unique': result}, status=status.HTTP_200_OK)


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = GetUserSerializer
    permission_classes = [IsManagerUser | IsAdminUser]


class AuthorizedUserView(APIView):
    @staticmethod
    def get(request):
        serializer = GetUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def patch(request):
        user = request.user
        put_serializer = PatchUserSerializer(user, data=request.data)
        put_serializer.is_valid(raise_exception=True)
        put_serializer.save()

        add_auth(request, user)
        get_serializer = GetUserSerializer(user)
        return Response(get_serializer.data, status=status.HTTP_200_OK)


class DepartmentList(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]


class DepartmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]


class SkillList(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]


class SkillDetail(generics.RetrieveDestroyAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUser]


class ResumeList(generics.ListAPIView):
    permission_classes = [IsManagerUser | IsAdminUser]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Resume.objects.all()
        elif self.request.user.is_manager:
            return Resume.objects.filter(status='PUBLIC')
        else:
            return Resume.objects.none()

    serializer_class = GetPostResumeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['$desired_position']
    filterset_class = ResumeFilter
    pagination_class = LimitOffsetPagination


class ResumeDetail(generics.RetrieveAPIView):
    permission_classes = [IsManagerUser | IsAdminUser]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Resume.objects.all()
        elif self.request.user.is_manager:
            return Resume.objects.filter(status='PUBLIC')
        else:
            return Resume.objects.none()

    serializer_class = GetPostResumeSerializer


class UserResumeView(APIView):
    @staticmethod
    def get(request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            serializer = GetPostResumeSerializer(resumes.first())
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @staticmethod
    def post(request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            return response_with_detail('This employee already has a resume', status.HTTP_409_CONFLICT)
        else:
            data = request.data.dict()
            data['employeeId'] = request.user.id
            serializer = GetPostResumeSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    @staticmethod
    def patch(request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            patch_serializer = PatchResumeSerializer(resume, data=request.data)
            patch_serializer.is_valid(raise_exception=True)
            patch_serializer.save()
            serializer = GetPostResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @staticmethod
    def delete(request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            resume.status = "DELETED"
            resume.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsManagerUser])
def resume_response(request, pk):
    resume = get_object_or_404(Resume, id=pk)
    result = send_resume_response(resume, request.user)
    return response_with_detail(result, status.HTTP_200_OK)


class VacancyList(generics.ListCreateAPIView):
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['$position']
    filterset_class = VacancyFilter
    pagination_class = LimitOffsetPagination

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [IsManagerUser()]

    def get_queryset(self):
        user = self.request.user
        base = Vacancy.objects
        if user.is_admin:
            return base.all()
        elif user.is_manager:
            return base.filter(status='PUBLIC') | base.filter(department=user.department, status='ARCHIVED')
        else:
            return base.filter(status='PUBLIC')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return GetVacancySerializer
        else:
            return PostVacancySerializer

    def post(self, request, *args, **kwargs):
        post_serializer = PostVacancySerializer(data=request.data)
        post_serializer.is_valid(raise_exception=True)
        vacancy = post_serializer.save(department=request.user.department)
        get_serializer = GetVacancySerializer(vacancy)
        return Response(get_serializer.data, status=status.HTTP_201_CREATED)


class VacancyDetail(generics.RetrieveUpdateDestroyAPIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated()]
        else:
            return [(IsManagerUser | IsAdminUser)()]

    def get_queryset(self):
        user = self.request.user
        base = Vacancy.objects
        if user.is_admin:
            return base.all()
        elif user.is_manager:
            return base.filter(status='PUBLIC') | base.filter(department=user.department, status='ARCHIVED')
        else:
            return base.filter(status='PUBLIC')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return GetVacancySerializer
        elif self.request.method == 'PATCH':
            return PatchVacancySerializer
        else:
            return None

    def patch(self, request, *args, **kwargs):
        result = super(VacancyDetail, self).patch(request, args, kwargs)
        if result.status_code == 200:
            vacancy = Vacancy.objects.get(id=kwargs['pk'])
            data = GetVacancySerializer(vacancy).data
            return Response(data, status=status.HTTP_200_OK)
        return result


    def delete(self, request, *args, **kwargs):
        vacancy = self.get_object()
        vacancy.status = 'DELETED'
        vacancy.save()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['POST'])
def vacancy_response(request, pk):
    vacancy = get_object_or_404(Vacancy, id=pk)

    manager = vacancy.department.manager
    if manager is None:
        return response_with_detail('Vacancy department does not have manager', status.HTTP_404_NOT_FOUND)

    resume = request.data.get('resume', None)
    if resume is None:
        resumes = Resume.objects.filter(employee=request.user).exclude(status='DELETED')
        if len(resumes) > 0:
            resume = resumes.first().resume
        else:
            return response_with_detail('Employee does not have resume', status.HTTP_400_BAD_REQUEST)

    serializer = VacancyResponseSerializer(data={'resume': resume})
    serializer.is_valid(raise_exception=True)
    result = send_vacancy_response(request.user, manager, vacancy, resume)
    return response_with_detail(result, status.HTTP_200_OK)


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


def add_auth(request, user):
    request.session['Authorization'] = f'Bearer {create_user_token(user)}'


def response_with_detail(message, response_status):
    return Response({'detail': message}, status=response_status)

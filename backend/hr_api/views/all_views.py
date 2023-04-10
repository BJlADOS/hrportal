from django.core.mail import send_mail, EmailMessage
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView

from .filters import *
from .serializers import *
from .shared import *
from ..permissions import IsManagerUser


class ResumeList(generics.ListAPIView):
    permission_classes = [IsManagerUser | IsAdminUser]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Resume.objects.all()
        elif self.request.user.is_manager:
            return Resume.objects.filter(status='PUBLIC')
        else:
            return Resume.objects.none()

    serializer_class = ResumeSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['$desired_position']
    filterset_class = ResumeFilter
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(tags=['Резюме'])
    def get(self, request, *args, **kwargs):
        return super(ResumeList, self).get(self, request, *args, **kwargs)


class ResumeDetail(generics.RetrieveAPIView):
    permission_classes = [IsManagerUser | IsAdminUser]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Resume.objects.all()
        elif self.request.user.is_manager:
            return Resume.objects.filter(status='PUBLIC')
        else:
            return Resume.objects.none()

    serializer_class = ResumeSerializer

    @swagger_auto_schema(tags=['Резюме'])
    def get(self, request, *args, **kwargs):
        return super(ResumeDetail, self).get(self, request, *args, **kwargs)


class UserResumeView(APIView):
    @swagger_auto_schema(tags=['Резюме'])
    def get(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            serializer = ResumeSerializer(resumes.first())
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(tags=['Резюме'])
    def post(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            return response_with_detail('This employee already has a resume', status.HTTP_409_CONFLICT)
        else:
            data = request.data.dict()
            data['employeeId'] = request.user.id
            serializer = ResumeSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(tags=['Резюме'])
    def patch(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            patch_serializer = ResumePatchDataSerializer(resume, data=request.data)
            patch_serializer.is_valid(raise_exception=True)
            patch_serializer.save()
            serializer = ResumeSerializer(resume)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(tags=['Резюме'])
    def delete(self, request):
        resumes = Resume.objects.filter(employee=request.user).exclude(status="DELETED")
        if len(resumes) > 0:
            resume = resumes.first()
            resume.status = "DELETED"
            resume.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return response_with_detail("This employee doesn't have a resume", status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(method='post', tags=['Резюме'])
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
            return VacancySerializer
        else:
            return VacancyPostDataSerializer

    @swagger_auto_schema(tags=['Вакансия'])
    def get(self, request, *args, **kwargs):
        return super(VacancyList, self).get(self, request, *args, **kwargs)

    @swagger_auto_schema(tags=['Вакансия'])
    def post(self, request, *args, **kwargs):
        post_serializer = VacancyPostDataSerializer(data=request.data)
        post_serializer.is_valid(raise_exception=True)
        vacancy = post_serializer.save(department=request.user.department)
        get_serializer = VacancySerializer(vacancy)
        return Response(get_serializer.data, status=status.HTTP_201_CREATED)


class VacancyDetail(generics.RetrieveUpdateDestroyAPIView):
    http_method_names = ["get", "patch", "delete"]

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
            return VacancySerializer
        elif self.request.method == 'PATCH':
            return VacancyPatchDataSerializer
        else:
            return None

    @swagger_auto_schema(tags=['Вакансия'])
    def get(self, request, *args, **kwargs):
        return super(VacancyDetail, self).get(self, request, *args, **kwargs)

    @swagger_auto_schema(tags=['Вакансия'])
    def patch(self, request, *args, **kwargs):
        result = super(VacancyDetail, self).patch(request, args, kwargs)
        if result.status_code == 200:
            vacancy = Vacancy.objects.get(id=kwargs['pk'])
            data = VacancySerializer(vacancy).data
            return Response(data, status=status.HTTP_200_OK)
        return result

    @swagger_auto_schema(tags=['Вакансия'])
    def delete(self, request, *args, **kwargs):
        vacancy = self.get_object()
        vacancy.status = 'DELETED'
        vacancy.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


@swagger_auto_schema(method='post', tags=['Вакансия'])
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

    serializer = VacancyResponseDataSerializer(data={'resume': resume})
    serializer.is_valid(raise_exception=True)
    result = send_vacancy_response(request.user, manager, vacancy, resume)
    return response_with_detail(result, status.HTTP_200_OK)


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

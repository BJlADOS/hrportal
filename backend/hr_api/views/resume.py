from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView

from .shared import *
from ..email import send_resume_response
from ..filters import *
from ..permissions import IsManagerUser
from ..serializers.resume import *


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

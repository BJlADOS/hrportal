from rest_framework import serializers

from .department import DepartmentSerializer
from .skill import SkillSerializer
from ..models import User, Skill, Department


class UserSerializer(serializers.ModelSerializer):
    currentDepartment = DepartmentSerializer(source='current_department')
    existingSkills = SkillSerializer(source='existing_skills', many=True)
    isManager = serializers.BooleanField(source='is_manager')
    isAdmin = serializers.BooleanField(source='is_admin')
    emailVerified = serializers.BooleanField(source='email_verified')
    resumeId = serializers.PrimaryKeyRelatedField(source='resume', read_only=True)
    photo = serializers.ImageField(use_url=False)

    class Meta:
        model = User
        fields = [
            'id',
            'fullname',
            'email',
            'contact',
            'experience',
            'currentDepartment',
            'photo',
            'existingSkills',
            'filled',
            'resumeId',
            'isManager',
            'isAdmin',
            'emailVerified'
        ]


class UserPatchDataSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(required=False, help_text='ФИО пользователя')
    email = serializers.EmailField(required=False, help_text='Email пользователя')
    contact = serializers.CharField(required=False, allow_null=True, help_text='Дополнительный контакт')
    experience = serializers.ChoiceField(required=False, allow_null=True, choices=User.EXPERIENCE_CHOICES,
                                         help_text='Стаж работы в компании')
    photo = serializers.ImageField(required=False, allow_null=True,
                                   help_text='Аватар пользователя')
    currentDepartmentId = serializers.PrimaryKeyRelatedField(source='current_department', required=False,
                                                             allow_null=True, queryset=Department.objects.all(),
                                                             help_text='ID отдела, в котором работает пользователь')
    existingSkillsIds = serializers.PrimaryKeyRelatedField(source='existing_skills', required=False, many=True,
                                                           queryset=Skill.objects.all(),
                                                           help_text='ID навыков, которыми владеет пользователь')

    def validate(self, attrs):
        if self.instance.is_manager and \
                'current_department' in attrs and \
                self.instance.department != attrs['current_department']:
            raise serializers.ValidationError(
                {'currentDepartmentId': f'User is manager of department {self.instance.department}'
                                        f' and therefore cannot be in another department'})
        return super(UserPatchDataSerializer, self).validate(attrs)

    class Meta:
        model = User
        fields = [
            'fullname',
            'email',
            'contact',
            'experience',
            'photo',
            'currentDepartmentId',
            'existingSkillsIds'
        ]

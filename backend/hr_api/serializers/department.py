from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ValidationError

from ..models import User, Department


def not_a_manager(user):
    if hasattr(user, 'department'):
        raise ValidationError(f'User with id={user.id} is already manager of department id={user.department.id}')
    else:
        return user


class DepartmentSerializer(ModelSerializer):
    managerId = PrimaryKeyRelatedField(source='manager', required=False, allow_null=True,
                                       queryset=User.objects.all(), validators=[not_a_manager],
                                       help_text="ID руководителя отдела")

    class Meta:
        model = Department
        fields = ['id', 'name', 'managerId']

from rest_framework import serializers

from ..models import Activity, Grade, ACTIVITY_STATUS_CHOICES


class ActivitySerializer(serializers.ModelSerializer):
    gradeId = serializers.PrimaryKeyRelatedField(source='grade', read_only=True)
    employeeId = serializers.PrimaryKeyRelatedField(source='grade.employee', read_only=True)
    status = serializers.ChoiceField(choices=ACTIVITY_STATUS_CHOICES)
    employeeReport = serializers.CharField(source='employee_report')

    class Meta:
        model = Activity
        fields = ['id', 'gradeId', 'employeeId', 'name', 'description', 'employeeReport', 'status']


class ActivityPostDataSerializer(serializers.ModelSerializer):
    gradeId = serializers.PrimaryKeyRelatedField(source='grade', queryset=Grade.objects.all())

    class Meta:
        model = Activity
        fields = ['name', 'gradeId', 'description']

    def to_representation(self, instance):
        return ActivitySerializer(instance).data


class ActivityPatchDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['name', 'description']

    def to_representation(self, instance):
        return ActivitySerializer(instance).data


class ActivityReportSerializer(serializers.ModelSerializer):
    employeeReport = serializers.CharField(source='employee_report', required=False)

    class Meta:
        model = Activity
        fields = ['employeeReport']

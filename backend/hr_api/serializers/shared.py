from datetime import datetime

from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Field


class TimestampField(Field):
    def to_internal_value(self, timestamp):
        return datetime.fromtimestamp(timestamp / 1000)

    def to_representation(self, date):
        return int(date.timestamp()) * 1000


def validate_filesize(max_filesize):
    def return_function(value):
        if value.size > max_filesize:
            raise ValidationError(f"You cannot upload file more than {max_filesize} bytes")
        else:
            return value

    return return_function

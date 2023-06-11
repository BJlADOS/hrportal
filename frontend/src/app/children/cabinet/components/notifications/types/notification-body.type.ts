import { INotificationResumeResponse } from '../interfaces/resume-response.interface';
import { INotificationVacancyResponse } from '../interfaces/vacancy-response.interface';
import { INotificationActivityReceived } from '../interfaces/notification-activity-received.interface';
import { INotificationActivityChanged } from '../interfaces/notification-activity-changed.interface';

export type NotificationBodyType =
    INotificationResumeResponse |
    INotificationVacancyResponse |
    INotificationActivityReceived |
    INotificationActivityChanged;

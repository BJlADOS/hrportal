import { NotificationType } from '../enums/notification-type.enum';
import { INotificationResumeResponse } from './resume-response.interface';
import { INotificationVacancyResponse } from './vacancy-response.interface';

export interface INotification {
    id: number;
    owner: number;
    type: NotificationType;
    value: INotificationResumeResponse | INotificationVacancyResponse;
    read: boolean;
    notifyTime: string;
}

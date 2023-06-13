import { NotificationType } from '../enums/notification-type.enum';
import { NotificationBodyType } from '../types/notification-body.type';

export interface INotification {
    id: number;
    owner: number;
    type: NotificationType;
    value: NotificationBodyType;
    read: boolean;
    notifyTime: string;
}

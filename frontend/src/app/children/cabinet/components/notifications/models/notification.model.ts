import { NotificationType } from '../enums/notification-type.enum';
import { INotification } from '../interfaces/notification.interface';
import { NotificationBodyType } from '../types/notification-body.type';
export class Notification {
    public owner: number;
    public id: number;
    public type: NotificationType;
    public read: boolean;
    public notifyTime: Date;
    public content: NotificationBodyType;
    public readState: string;

    constructor(data: INotification) {
        this.id = data.id;
        this.type = data.type;
        this.owner = data.owner;
        this.readState = data.read ? 'Прочитано' : 'Не прочитано';
        this.read = data.read;
        this.notifyTime = new Date(parseInt(data.notifyTime));
        this.content = data.value;
    }

}

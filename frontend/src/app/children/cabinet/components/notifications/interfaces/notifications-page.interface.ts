import { INotification } from './notification.interface';

export interface INotificationsPage {
    count: number;
    next: string;
    previous: string;
    results: INotification[];
}

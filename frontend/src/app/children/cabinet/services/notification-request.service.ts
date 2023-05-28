import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { INotificationRequestParams } from '../components/notifications/interfaces/notification-request-params.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { INotification } from '../components/notifications/interfaces/notification.interface';
import { IPage } from '../../../lib';

const apiURL: string = environment.apiURL + '/user/notifications';

@Injectable({
    providedIn: 'root'
})
export class NotificationRequestService {

    constructor(private _http: HttpClient) { }

    public getNotificationsPage(params: INotificationRequestParams): Observable<IPage<INotification>> {
        return this._http.get<IPage<INotification>>(apiURL, { params: { ...params } });
    }

    public markAsRead(id: number): Observable<void> {
        return this._http.patch<void>(`${apiURL}/${id}/read/`, { id });
    }
}

import { Injectable } from '@angular/core';
import { IPage, PageLazyLoadingService } from '../../../../../lib';
import { INotification } from '../interfaces/notification.interface';
import { INotificationRequestParams } from '../interfaces/notification-request-params.interface';
import { NotificationService } from '../../../services/notification.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationsPageLazyLoadingService extends PageLazyLoadingService<INotification, INotificationRequestParams>{

    constructor(
        private _notificationService: NotificationService,
    ) {
        super();
    }

    protected override receiveData(params?: INotificationRequestParams): Observable<IPage<INotification>> {
        if (!params) {
            params = {
                offset: 0,
                limit: 4,
            };
        }

        return this._notificationService.getNotificationPages(params);
    }
}

import { Injectable } from '@angular/core';
import { NotificationRequestService } from './notification-request.service';
import { map, Observable } from 'rxjs';
import {
    DepartmentService,
    IDepartment,
    IResume,
    IUser,
    IVacancy,
    ResumeService,
    UserService,
    VacancyService
} from '../../../common';
import { INotificationRequestParams } from '../components/notifications/interfaces/notification-request-params.interface';
import { IPage } from '../../../lib';
import { INotification } from '../components/notifications/interfaces/notification.interface';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(
        private _requestService: NotificationRequestService,
        private _userService: UserService,
        private _vacancyService: VacancyService,
        private _resumeService: ResumeService,
        private _departmentService: DepartmentService,
    ) { }

    public getNotificationPages(params: INotificationRequestParams): Observable<IPage<INotification>> {
        return this._requestService.getNotificationsPage(params);
    }

    public getEmployee(id: number): Observable<IUser> {
        return this._userService.getUserById(id);
    }

    public getVacancy(id: number): Observable<IVacancy> {
        return this._vacancyService.getVacancyById(id.toString());
    }

    public getResume(): Observable<IResume> {
        return this._userService.getResume();
    }

    public markAsRead(id: number): Observable<void> {
        return this._requestService.markAsRead(id);
    }

    public getDepartment(id: number): Observable<string> {
        return this._departmentService.departments$
            .pipe(
                map((departments: IDepartment[]) => {
                    if (departments) {
                        const department: IDepartment | undefined = departments.find((d: IDepartment) => d.id === id);

                        return department ? department.name : 'Неизвестный департамент';
                    }

                    return 'Неизвестный департамент';
                },
                )
            );
    }
}

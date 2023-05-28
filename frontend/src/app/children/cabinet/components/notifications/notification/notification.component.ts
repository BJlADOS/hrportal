import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { Notification } from '../models/notification.model';
import { IResume, IUser, IVacancy, UserService } from '../../../../../common';
import { NotificationService } from '../../../services/notification.service';
import { Observable } from 'rxjs';
import { NotificationType } from '../enums/notification-type.enum';
import { INotificationVacancyResponse } from '../interfaces/vacancy-response.interface';
import { INotificationResumeResponse } from '../interfaces/resume-response.interface';
import { INotification } from '../interfaces/notification.interface';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {

    @Input() public notification!: INotification;

    public notificationViewModel!: Notification;
    public resume$!: Observable<IResume>;
    public vacancy$!: Observable<IVacancy>;
    public employee$!: Observable<IUser>;
    public department$!: Observable<string>;

    constructor(
        private _userService: UserService,
        private _notificationService: NotificationService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.notificationViewModel = new Notification(this.notification);

        switch (this.notification.type) {
            case NotificationType.RESUME_RESPONSE:
                this.resume$ = this._notificationService.getResume();
                this.employee$ = this._notificationService.getEmployee((this.notificationViewModel.content as INotificationResumeResponse).manager);
                break;
            case NotificationType.VACANCY_RESPONSE:
                this.vacancy$ = this._notificationService.getVacancy((this.notificationViewModel.content as INotificationVacancyResponse).vacancy);
                this.employee$ = this._notificationService.getEmployee(this.notificationViewModel.content.employee);
                break;
        }

        this.department$ = this._notificationService.getDepartment(this.notificationViewModel.content.department);
    }

    public markRead(): void {
        !this.notificationViewModel.read && this._notificationService.markAsRead(this.notification.id)
            .subscribe(() => {
                this.notificationViewModel = new Notification({
                    ...this.notification,
                    read: true,
                });
                this._changeDetectorRef.markForCheck();
            });
    }

    public getEmployeeName(name: string): string {
        const fullName: string[] = name.split(' ');

        return `${fullName[0]} ${fullName[1]}`;
    }

    protected readonly NotificationType = NotificationType;
}

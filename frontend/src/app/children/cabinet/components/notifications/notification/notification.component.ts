import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Notification } from '../models/notification.model';
import { IResume, IUser, IVacancy, UserService } from '../../../../../common';
import { NotificationService } from '../../../services/notification.service';
import { Observable } from 'rxjs';
import { NotificationType } from '../enums/notification-type.enum';
import { INotificationVacancyResponse } from '../interfaces/vacancy-response.interface';
import { INotificationResumeResponse } from '../interfaces/resume-response.interface';
import { INotification } from '../interfaces/notification.interface';
import { INotificationActivityReceived } from '../interfaces/notification-activity-received.interface';
import { INotificationActivityChanged } from '../interfaces/notification-activity-changed.interface';
import { ActivityRequestService } from '../../../../../common/cabinet/grade/services/activity-request.service';
import { ActivityModel } from '../../../../../common/cabinet/grade/models/activity.model';
import { ActivityStateModelConst } from '../../../../../common/cabinet/grade/models/activity-state-model.const';
import { ActivityStatus } from '../../../../../common/cabinet/grade/enums/activity-status.enum';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ActivityRequestService
    ]
})
export class NotificationComponent implements OnInit {

    @Input() public notification!: INotification;

    public notificationViewModel!: Notification;
    public resume$!: Observable<IResume>;
    public vacancy$!: Observable<IVacancy>;
    public employee$!: Observable<IUser>;
    public department$!: Observable<string>;
    public activity$!: Observable<ActivityModel>;
    public activityStatus!: ActivityStatus;

    constructor(
        private _userService: UserService,
        private _notificationService: NotificationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activityRequestService: ActivityRequestService
    ) { }

    public ngOnInit(): void {
        this.notificationViewModel = new Notification(this.notification);

        switch (this.notification.type) {
            case NotificationType.RESUME_RESPONSE: {
                const notificationBody: INotificationResumeResponse = this.notificationViewModel.content as INotificationResumeResponse;
                this.resume$ = this._notificationService.getResume();
                this.employee$ = this._notificationService.getEmployee(notificationBody.manager);
                this.department$ = this._notificationService.getDepartment(notificationBody.department);
                break;
            }
            case NotificationType.VACANCY_RESPONSE: {
                const notificationBody: INotificationVacancyResponse = this.notificationViewModel.content as INotificationVacancyResponse;
                this.vacancy$ = this._notificationService.getVacancy(notificationBody.vacancy);
                this.employee$ = this._notificationService.getEmployee(notificationBody.employee);
                this.department$ = this._notificationService.getDepartment(notificationBody.department);
                break;
            }
            case NotificationType.activityReceived: {
                const notificationBody: INotificationActivityReceived = this.notificationViewModel.content as INotificationActivityReceived;
                this.employee$ = this._notificationService.getEmployee(notificationBody.employeeId);
                this.activity$ = this._activityRequestService.getAllActivityById(notificationBody.activityId);
                break;
            }
            case NotificationType.activityStatusChanged: {
                const notificationBody: INotificationActivityChanged = this.notificationViewModel.content as INotificationActivityChanged;
                this.employee$ = this._notificationService.getEmployee(notificationBody.managerId);
                this.activity$ = this._activityRequestService.getAllActivityById(notificationBody.activityId);
                this.activityStatus = notificationBody.decision as any as ActivityStatus;
                break;
            }
        }

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
    protected readonly ActivityStateModelConst = ActivityStateModelConst;
    protected readonly ActivityStatus = ActivityStatus;
}

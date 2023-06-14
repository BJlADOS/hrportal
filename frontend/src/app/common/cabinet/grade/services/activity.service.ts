import { Injectable } from '@angular/core';
import { ActivityModel } from '../models/activity.model';
import { ActivityRequestService } from './activity-request.service';
import { Observable, of, tap } from 'rxjs';
import { IActivityRequest, IEmployeeReportRequest } from '../interfaces/activity-request.interface';
import { ActivityStatus } from '../enums/activity-status.enum';

@Injectable()
export class ActivityService {

    public activities: ActivityModel[] = [];
    constructor(
        private _request: ActivityRequestService,
    ) {
    }

    public addEmptyActivity(employeeId: number, gradeId?: number): void {
        this.activities.push(new ActivityModel({
            employeeId,
            gradeId,
        }));
    }

    public clearAll(): void {
        this.activities = [];
    }

    public addActivity(activity: ActivityModel): void {
        this.activities.push(activity);
    }

    public isAllCompleted(): boolean {
        return !this.activities.some(a => a.status !== ActivityStatus.completed && a.status !== ActivityStatus.canceled);
    }

    public removeActivity(activity: ActivityModel): Observable<void> {
        if (activity.id) {
            return this.deleteActivity(activity.id)
                .pipe(tap({
                    next: () => {
                        this.activities.splice(this.activities.indexOf(activity), 1);
                    }
                }));
        } else {
            this.activities.splice(this.activities.indexOf(activity), 1);

            return of();
        }
    }

    public getActivityById(id: number): ActivityModel {
        return this.activities.find((a) => a.id === id)!;
    }

    public getActivityByIndex(index: number): ActivityModel {
        return this.activities[index];
    }

    //Requests
    public getActivitiesForReview(): Observable<ActivityModel[]> {
        return this._request.getActivitiesForReview();
    }

    public changeActivity(oldActivity: ActivityModel, newActivity: ActivityModel): ActivityModel {
        const index = this.activities.indexOf(oldActivity);
        this.activities[index] = newActivity;

        return this.activities[index];
    }

    public createActivity(activity: ActivityModel, gradeId: number): Observable<ActivityModel> {
        const params: IActivityRequest = {
            name: activity.name!,
            description: activity.description,
            gradeId
        };

        return this._request.createActivity(params);
    }

    public updateActivity(activity: ActivityModel): Observable<ActivityModel> {
        const params: IActivityRequest = {
            name: activity.name!,
            description: activity.description,
        };

        return this._request.updateActivity(params, activity.id!);
    }

    public completeActivity(id: number): Observable<void> {
        return this._request.completeActivity(id);
    }

    public cancelActivity(id: number): Observable<void> {
        return this._request.cancelActivity(id);
    }

    public sendActivityToReview(activity: ActivityModel ): Observable<void> {
        const params: IEmployeeReportRequest = {
            employeeReport: activity.employeeReport!,
        };

        return this._request.sendActivityToReview(params, activity.id!);
    }

    public returnActivity(id: number): Observable<void> {
        return this._request.returnActivity(id);
    }

    public deleteActivity(id: number): Observable<void> {
        return this._request.deleteActivity(id);
    }
}

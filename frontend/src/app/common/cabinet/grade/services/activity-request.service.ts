import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IGrade } from '../interfaces/grade.interface';
import { environment } from '../../../../../environments/environment';
import { GradeModel } from '../models/grade.model';
import { ActivityModel } from '../models/activity.model';
import { IActivity } from '../interfaces/activity.interface';
import { IGradeRequest } from '../interfaces/grade-request.interface';
import { IActivityRequest, IEmployeeReportRequest } from '../interfaces/activity-request.interface';

@Injectable()
export class ActivityRequestService {
    private _apiUrl: string = environment.apiURL;

    constructor(
        private _http: HttpClient,
    ) {
    }

    public getAllActivities(): Observable<ActivityModel[]> {
        return this._http.get<IActivity[]>(`${this._apiUrl}/activities/`)
            .pipe(
                map(activities => activities.map(a => new ActivityModel(a)))
            );
    }

    public getActivitiesForReview(): Observable<ActivityModel[]> {
        return this._http.get<IActivity[]>(`${this._apiUrl}/activities/onReview/`)
            .pipe(
                map(activities => activities.map(a => new ActivityModel(a)))
            );
    }

    public updateActivity(activity: IActivityRequest, id: number): Observable<ActivityModel> {
        return this._http.patch<IActivity>(`${this._apiUrl}/activities/${id}/`, activity)
            .pipe(
                map(a => new ActivityModel(a))
            );
    }

    public createActivity(activity: IActivityRequest): Observable<ActivityModel> {
        return this._http.post<IActivity>(`${this._apiUrl}/activities/`, activity)
            .pipe(
                map(a => new ActivityModel(a))
            );
    }

    public cancelActivity(id: number): Observable<void> {
        return this._http.patch<void>(`${this._apiUrl}/activities/${id}/cancel/`, id);
    }

    public completeActivity(id: number): Observable<void> {
        return this._http.patch<void>(`${this._apiUrl}/activities/${id}/complete/`, id);
    }

    public returnActivity(id: number): Observable<void> {
        return this._http.patch<void>(`${this._apiUrl}/activities/${id}/return/`, id);
    }

    public sendActivityToReview(employeeReport: IEmployeeReportRequest ,id: number): Observable<void> {
        return this._http.patch<void>(`${this._apiUrl}/activities/${id}/toReview/`, employeeReport);
    }

    public deleteActivity(id: number): Observable<void> {
        return this._http.delete<void>(`${this._apiUrl}/activities/${id}/`);
    }
}

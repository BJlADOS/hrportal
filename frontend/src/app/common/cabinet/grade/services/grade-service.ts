import { Injectable } from '@angular/core';
import { GradeModel } from '../models/grade.model';
import { Observable } from 'rxjs';
import { IGradeRequest } from '../interfaces/grade-request.interface';
import { GradeRequestService } from './grade-request.service';

@Injectable()
export class GradeService {

    constructor(
        private _request: GradeRequestService,
    ) {
    }

    public createGrade(grade: GradeModel): Observable<GradeModel> {
        const params: IGradeRequest = {
            name: grade.name,
            employeeId: grade.employeeId,
            expirationDate: grade.expirationDate,
            activities: grade.activities.map(a => ({
                name: a.name!,
                description: a.description,
            })),
        };

        return this._request.createGrade(params);
    }

    public updateGrade(grade: GradeModel, id: number): Observable<GradeModel> {
        const params: IGradeRequest = {
            name: grade.name,
            expirationDate: grade.expirationDate,
        };

        return this._request.updateGrade(params, id);
    }

    public completeGrade(id: number): Observable<void> {
        return this._request.completeGrade(id);
    }

    public getUserGrades(userId: number): Observable<GradeModel[]> {
        return this._request.getUserGrades(userId);
    }

    public deleteGrade(id: number): Observable<void> {
        return this._request.deleteGrade(id);
    }
}

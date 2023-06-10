import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GradeModel } from '../models/grade.model';
import { IGrade } from '../interfaces/grade.interface';
import { IGradeRequest } from '../interfaces/grade-request.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class GradeRequestService {

    private _apiUrl: string = environment.apiURL;

    constructor(
        private _http: HttpClient,
    ) {
    }

    public getUserGrades(userId: number): Observable<GradeModel[]> {
        return this._http.get<IGrade[]>(`${this._apiUrl}/users/${userId}/grades/`)
            .pipe(
                map(grades => grades.map(grade => new GradeModel(grade)))
            );
    }

    public createGrade(grade: IGradeRequest): Observable<GradeModel> {
        return this._http.post<IGrade>(`${this._apiUrl}/grades/`, grade)
            .pipe(
                map(grade => new GradeModel(grade))
            );
    }

    public updateGrade(grade: IGradeRequest, id: number): Observable<GradeModel> {
        return this._http.patch<IGrade>(`${this._apiUrl}/grades/${id}/`, grade)
            .pipe(
                map(grade => new GradeModel(grade))
            );
    }

    public completeGrade(id: number): Observable<void> {
        return this._http.patch<void>(`${this._apiUrl}/grades/${id}/complete/`, id);
    }

    public deleteGrade(id: number): Observable<void> {
        return this._http.delete<void>(`${this._apiUrl}/grades/${id}/`);
    }

}

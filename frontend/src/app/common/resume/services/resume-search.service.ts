import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResumePage } from '../interfaces/resume-page.interface';
import { IResumeRequest } from '../interfaces/resume-request.interface';
import { DestroyService, Ordering } from '../../../lib';
import { ResumeService } from './resume.service';
import { IFilterRequest } from '../../vacancy';
import { Status } from '../../../lib/utils/enums/status.enum';
import { IDepartment } from '../../department';

@Injectable({
    providedIn: 'root',
})
export class ResumeSearchService {

    public resumesSubject$: BehaviorSubject<IResumePage> = new BehaviorSubject<IResumePage>( { count: 0, next: null, previous: null, results: [] });
    public resumes$ : Observable<IResumePage> = this.resumesSubject$.asObservable();
    private _concreteDepartment?: IDepartment;

    private _filterRequest: IResumeRequest = {
        employment: [],
        schedule: [],
        skills: undefined,
        status: undefined,
        ordering: Ordering['-time'],
        search: undefined,
        limit: 5,
        offset: 0,
        salary_min: undefined,
        salary_max: undefined,
    };

    constructor(
        private _resume: ResumeService,
        private _destroy$: DestroyService,
    ) { }

    public setDepartment(department: IDepartment): void {
        this._concreteDepartment = department;
    }

    public setFilters(filter: IResumeRequest): void {
        if (filter.salary_min && filter.salary_max) {
            filter.salary_min = filter.salary_min > filter.salary_max ? filter.salary_max : filter.salary_min;
            filter.salary_max = filter.salary_max < filter.salary_min ? filter.salary_min : filter.salary_max;
        }

        Object.assign(this._filterRequest, filter);
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public search(search?: string): void {
        this._filterRequest.search = search;
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public changeStatus(type: Status): void {
        this._filterRequest.status = type;
    }

    public sort(ordering: Ordering): void {
        this._filterRequest.ordering = ordering;
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public loadMore(): void {
        if ((this._filterRequest.offset! + this._filterRequest.limit!) >= this.resumesSubject$.value.count) {
            return;
        }
        this._filterRequest.offset! += this._filterRequest.limit!;
        this.makeSearch();
    }

    public resetAll(): void {
        this._filterRequest = {
            employment: [],
            schedule: [],
            skills: undefined,
            status: undefined,
            ordering: Ordering['-time'],
            search: undefined,
            limit: 5,
            offset: 0,
            salary_min: undefined,
            salary_max: undefined,
        };
        this.resumesSubject$.next({ count: 0, next: null, previous: null, results: [] });
    }

    private makeSearch(): void {
        if (this._concreteDepartment) {
            this._filterRequest.department = [this._concreteDepartment as any];
        }

        this._resume.getResumes(this.buildRequestObject())
            .subscribe({ next: (data : IResumePage) => {
                this.resumesSubject$.next(data);
            } });
    }

    private buildRequestObject(): IFilterRequest {
        const request: any = {};

        Object.keys(this._filterRequest).forEach((key, i) => {
            if (Object.values(this._filterRequest)[i]) {
                if (Array.isArray(Object.values(this._filterRequest)[i])) {
                    if (Object.values(this._filterRequest)[i].length === 0) {
                        return;
                    }
                    request[key] = Object.values(this._filterRequest)[i].map((item: any) => item.id);
                } else {
                    request[key] = Object.values(this._filterRequest)[i];
                }

            }
        });

        return request;
    }
}

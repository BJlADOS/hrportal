import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { EmployeeService } from './employee.service';
import { BufferSubject, clearFromNullable, IPage, Ordering } from '../../../../../../../lib';
import { IUser } from '../../../../../../../common';
import { IEmployeeRequestParams } from '../data/param-interfaces/employee-request-params.interface';
import { EMPLOYEE_LIST_TOKEN } from '../tokens/employee-list.token';

@Injectable()
export class EmployeeSearchService {

    public resumesSubject$: BehaviorSubject<IPage<IUser>> = new BehaviorSubject<IPage<IUser>>( {
        count: 0,
        next: null,
        previous: null,
        results: []
    });

    public employees$ : Observable<IPage<IUser>> = this.resumesSubject$.asObservable();

    private _filterRequest: IEmployeeRequestParams = {
        limit: 3,
        offset: 0,
    };

    constructor(
        @Inject(EMPLOYEE_LIST_TOKEN) protected modelBuffer$: BufferSubject<IEmployeeRequestParams, IPage<IUser>>
    ) { }

    public setFilters(filter: IEmployeeRequestParams): void {
        Object.assign(this._filterRequest, filter);
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public search(search?: string): void {
        this._filterRequest.search = search;
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public sort(ordering: Ordering): void {
        // this._filterRequest.ordering = ordering;
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
            limit: 5,
            offset: 0,
        };

        this.resumesSubject$.next({ count: 0, next: null, previous: null, results: [] });
    }

    private makeSearch(): void {
        this.modelBuffer$.update(clearFromNullable(this._filterRequest));
    }
}

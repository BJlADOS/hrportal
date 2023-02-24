import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IFilter, IFilterRequest, IVacancyPage } from '../interfaces';
import { DestroyService, Ordering } from '../../../lib';
import { VacancyService } from './vacancy.service';

@Injectable()
export class VacanciesSearchService {

    public vacanciesSubject$: BehaviorSubject<IVacancyPage> = new BehaviorSubject<IVacancyPage>({ count: 0, next: null, previous: null, results: [] });
    public vacancies$: Observable<IVacancyPage> = this.vacanciesSubject$.asObservable();

    private _filterRequest: IFilterRequest = {
        salary_min: undefined,
        salary_max: undefined,
        departments: [],
        employment: [],
        schedule: [],
        skills: undefined,
        ordering: Ordering['-time'],
        limit: 4,
        offset: 0,
        search: undefined,
    };

    constructor(
    private _vacancy: VacancyService,
    private _destroy$: DestroyService,
    ) { }

    public setFilters(filter: IFilter): void {
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

    public sort(ordering: Ordering): void {
        this._filterRequest.ordering = ordering;
        this._filterRequest.offset = 0;
        this.makeSearch();
    }

    public loadMore(): void {
        if ((this._filterRequest.offset! + this._filterRequest.limit!) >= this.vacanciesSubject$.value.count) {
            return;
        }
    this._filterRequest.offset! += this._filterRequest.limit!;
    this.makeSearch();
    }

    public changePage(page: number): void {
        this._filterRequest.offset = page * this._filterRequest.limit!;
        this.makeSearch();
    }

    public resetFilters(): void {
        this._filterRequest.employment = [];
        this._filterRequest.schedule = [];
        this._filterRequest.skills = [];
        this._filterRequest.departments = [];
        this._filterRequest.salary_min = undefined;
        this._filterRequest.salary_max = undefined;
        this.makeSearch();
    }

    public resetAll(): void {
        this._filterRequest = {
            salary_min: undefined,
            salary_max: undefined,
            departments: [],
            employment: [],
            schedule: [],
            skills: undefined,
            ordering: Ordering['-time'],
            limit: 4,
            offset: 0,
            search: undefined,
        };
        this.vacanciesSubject$.next({ count: 0, next: null, previous: null, results: [] });
    }

    private makeSearch(): void {
        this._vacancy.getVacancies(this.buildRequestObject()).subscribe({ next: (data) => {
            this.vacanciesSubject$.next(data);
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

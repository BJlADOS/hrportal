import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { IVacancyPage } from 'src/app/interfaces/pagination';
import { IFilter, IFilterRequest, Ordering } from 'src/app/interfaces/search';
import { Employment, IVacancy } from 'src/app/interfaces/vacancy';
import { DestroyService } from '../destoy/destroy.service';
import { VacancyService } from '../vacancy/vacancy.service';

@Injectable({
  providedIn: 'root'
})
export class VacanciesSearchService {

  public vacanciesSubject$: BehaviorSubject<IVacancyPage> = new BehaviorSubject<IVacancyPage>({ count: 0, next: null, previous: null, results: [] });
  public vacancies$: Observable<IVacancyPage> = this.vacanciesSubject$.asObservable();

  private _filterRequest: IFilterRequest = {
    salary_min: undefined,
    salary_max: undefined,
    employment: undefined,
    schedule: undefined,
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
    this._filterRequest.employment = undefined;
    this._filterRequest.schedule = undefined;
    this._filterRequest.skills = undefined;
    this._filterRequest.salary_min = undefined;
    this._filterRequest.salary_max = undefined;
    this.makeSearch();
  }

  public resetAll(): void {
    this._filterRequest = {
      salary_min: undefined,
      salary_max: undefined,
      employment: undefined,
      schedule: undefined,
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
        request[key] = Object.values(this._filterRequest)[i];
      }
    });

    return request;
  }
}

import { Injectable } from '@angular/core';
import { clearFromNullable } from '../../../../../../../lib';
import { IEmployeeRequestParams } from '../data/param-interfaces/employee-request-params.interface';
import { EmployeePageLazyLoadingService } from './employee-page-lazy-loading.service';
import { IEmployeeFilterParams } from '../interfaces/employee-filter-params.interface';

@Injectable()
export class EmployeeSearchService {
    private _searchString: string | undefined;
    private _filterParams: IEmployeeFilterParams | undefined;
    private _searchActive: boolean = true;
    /** Когда запрос уже отправлен, невозможно отправить новый до получения ответа старого */
    private _requestingLocked: boolean = false;

    constructor(
        private _pageDataService: EmployeePageLazyLoadingService
    ) { }

    /**
     * Сделать запрос с фильтрацией
     * */
    public setFilters(filter: IEmployeeFilterParams): void {
        this._pageDataService.clearPageData();
        this._filterParams = filter;
        this._requestingLocked = true;
        this.makeRequest();
    }

    /**
     * Постаивть статус для поиска по умолчанию
     * @param active Статус пользователя
     */
    public setDefaultStatus(active: boolean): void {
        this._searchActive = active;
    }

    /**
     * Сделать запрос с поиском по строке
     * */
    public search(search?: string): void {
        this._pageDataService.clearPageData();
        this._searchString = search;
        this._requestingLocked = true;
        this.makeRequest();
    }

    /**
     * Добавить список еще элементов
     * */
    public loadMore(): void {
        if (this._pageDataService.itemsLoaded >= this._pageDataService.itemsCount) {
            return;
        }

        this.makeRequest();
    }

    /**
     * Отправить запрос для получения данных списка
     * */
    private makeRequest(): void {
        this._pageDataService.addPage(this.getRequestData())
            .subscribe(() => {
                this._requestingLocked = false;
            });
    }

    /**
     * Получить список текущих параметров поиска для запроса
     * */
    private getRequestData(): IEmployeeRequestParams {
        return clearFromNullable({
            ...this._filterParams,
            active: this._searchActive,
            search: this._searchString,
            offset: this._pageDataService.itemsLoaded,
            limit: 3
        });
    }
}

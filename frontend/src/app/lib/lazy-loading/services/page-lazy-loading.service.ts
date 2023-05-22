import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { IPage } from '../../utils';

@Injectable()
export abstract class PageLazyLoadingService<TData, TParams> {
    public get list$(): Observable<TData[] | null> {
        return this._list$.asObservable();
    }

    public lastPage: IPage<TData> | null = null;
    public itemsCount: number = 0;
    public itemsLoaded: number = 0;
    private _dataClearPlanned: boolean = false;
    private _list$: BehaviorSubject<TData[] | null> = new BehaviorSubject<TData[] | null>(null);

    /**
     * Метод для получения данных в список элементов.
     * */
    protected abstract receiveData(params?: TParams): Observable<IPage<TData>>;

    public addPage(params?: TParams): Observable<void> {
        const valueReceived$: Subject<void> = new Subject<void>();

        this.receiveData(params)
            .pipe(
                take(1)
            )
            .subscribe((newPage: IPage<TData>) => {
                if (this._dataClearPlanned) {
                    this.clearPageData();
                    this._dataClearPlanned = false;
                }

                this.lastPage = newPage;
                this.itemsCount = newPage.count ?? this.itemsCount;
                this.itemsLoaded += newPage.results?.length;
                this._list$.next(this._list$.value?.concat(newPage.results) ?? newPage.results);
                valueReceived$.next();
                valueReceived$.complete();
            });

        return valueReceived$.asObservable();
    }

    public clearPageData(): void {
        this._list$.next(null);
        this.lastPage = null;
        this.itemsCount = 0;
        this.itemsLoaded = 0;
    }

    public planClear(): void {
        this._dataClearPlanned = true;
    }
}

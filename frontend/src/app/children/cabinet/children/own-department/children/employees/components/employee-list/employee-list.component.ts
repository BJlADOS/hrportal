import { Component, Inject, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { BufferSubject, contentExpansionHorizontal, DestroyService, IPage } from '../../../../../../../../lib';
import { IUser } from '../../../../../../../../common';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { EMPLOYEE_LIST_TOKEN } from '../../tokens/employee-list.token';
import { IEmployeeRequestParams } from '../../data/param-interfaces/employee-request-params.interface';

@Component({
    selector: 'employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
    animations: [contentExpansionHorizontal],
    providers: [
        DestroyService
    ],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
    public employeesData$: Observable<IPage<IUser> | null> = this.modelBuffer$.value$;
    public employeesModelList$: BehaviorSubject<IUser[] | null> = new BehaviorSubject<IUser[] | null>(null);
    public loadingError: string | undefined;

    public canScrollBack: boolean = false;
    public filtersExpanded: boolean = false;
    public update$: Subject<boolean> = new Subject<boolean>();

    private _resumesAmount: number = 0;
    private _callback : EventListener = this.setTimeout(this.checkPosition.bind(this), 250);

    constructor(
        private _employeeSearchService: EmployeeSearchService,
        private _destroyService$: DestroyService,
        @Inject(EMPLOYEE_LIST_TOKEN) protected modelBuffer$: BufferSubject<IEmployeeRequestParams, IPage<IUser>>
    ) {
        this.modelBuffer$.update();
    }

    public ngOnInit(): void {
        this.employeesData$
            .pipe(takeUntil(this._destroyService$))
            .subscribe({
                next: (page: IPage<IUser> | null) => {
                    if (page) {
                        this.employeesModelList$.next(this.employeesModelList$.value?.concat(page.results) ?? page.results);
                        this._resumesAmount = page.count;
                        this.update$.next(true);
                    }
                },
                error: (error: string) => {
                    if (isDevMode()) {
                        console.log(error);
                    }

                    this.loadingError = error;
                }
            });

        window.addEventListener('scroll', this._callback);
        window.addEventListener('resize', this._callback);
    }

    public ngOnDestroy(): void {
        this.update$.complete();
        window.removeEventListener('scroll', this._callback);
        window.removeEventListener('resize', this._callback);
        this.resetSearch();
        this._employeeSearchService.resetAll();
    }

    public toggleFilters(): void {
        this.filtersExpanded = !this.filtersExpanded;
        setTimeout(() => {
            this.update$.next(true);
        }, 700);
    }

    public resetSearch(): void {
        this.employeesModelList$.next(null);
        this._resumesAmount = 0;
    }

    public scrollBack(): void {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    private async checkPosition(): Promise<void> {
        const height: number = document.body.offsetHeight;
        const screenHeight: number = window.innerHeight;
        const scrolled: number = window.scrollY;
        const threshold: number = height - screenHeight / 4;
        const position: number = scrolled + screenHeight;
        this.canScrollBack = scrolled > 0;

        if (position >= threshold && this.employeesModelList$.value?.length !== this._resumesAmount) {
            this._employeeSearchService.loadMore();
        }
    }

    private setTimeout(callee: Function, timeout: number): EventListener {
        let timer: NodeJS.Timeout | null = null;

        return function perform() {
            if (timer) {
                return;
            }

            timer = setTimeout(() => {
                callee();

                timer = null;
            }, timeout);
        };
    }
}

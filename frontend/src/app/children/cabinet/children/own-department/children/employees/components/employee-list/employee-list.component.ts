import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, takeUntil } from 'rxjs';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../../../lib';
import { IUser } from '../../../../../../../../common';
import { EmployeeSearchService } from '../../services/employee-search.service';
import {
    WINDOW_SCROLLED_TO_END_PROVIDER
} from '../../../../../../../../lib/utils/window-scrolled-to-end/window-scrolled-to-end.provider';
import {
    WINDOW_SCROLLED_TO_END_TOKEN
} from '../../../../../../../../lib/utils/window-scrolled-to-end/window-scrolled-to-end.token';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';

@Component({
    selector: 'employee-list',
    templateUrl: './employee-list.component.html',
    styleUrls: ['./employee-list.component.scss'],
    animations: [contentExpansionHorizontal],
    providers: [
        DestroyService,
        WINDOW_SCROLLED_TO_END_PROVIDER
    ],
})
export class EmployeeListComponent {
    public employeesModelList$: BehaviorSubject<IUser[] | null> = new BehaviorSubject<IUser[] | null>(null);
    public loadingError: string | undefined;

    @Output() public reloadPage: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private _employeeSearchService: EmployeeSearchService,
        private _destroyService$: DestroyService,
        private _pageDataService: EmployeePageLazyLoadingService,
        @Inject(WINDOW_SCROLLED_TO_END_TOKEN) protected windowScrolledToEnd$: Observable<void>
    ) {
        this.windowScrolledToEnd$
            .pipe(
                takeUntil(this._destroyService$)
            )
            .subscribe(() => {
                this.getMoreEmployees();
            });

        this.configureDataReceiving();
    }

    public getMoreEmployees(): void {
        this._employeeSearchService.loadMore();
    }

    public userEdited(): void {
        this.reloadPage.emit();
    }

    private configureDataReceiving(): void {
        this._pageDataService.list$
            .pipe(
                catchError((error: any) => {
                    this.loadingError = error;

                    return of([]);
                })
            )
            .subscribe(this.employeesModelList$);
    }
}

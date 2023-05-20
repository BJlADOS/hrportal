import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { contentExpansionHorizontal } from '../../../../../../../../lib';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';

@Component({
    templateUrl: 'employee-list-layout.component.html',
    styleUrls: ['employee-list-layout.component.scss'],
    animations: [contentExpansionHorizontal],
})
export class EmployeeListLayoutComponent {
    protected filtersOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        public pageDataService: EmployeePageLazyLoadingService
    ) {

    }

    protected toggleFilters(): void {
        this.filtersOpened$.next(!this.filtersOpened$.value);
    }
}

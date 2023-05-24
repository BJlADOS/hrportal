import {Component, ViewChild} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { contentExpansionHorizontal } from '../../../../../../../../lib';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';
import {EmployeeFiltersComponent} from "../employee-filters/employee-filters.component";

@Component({
    selector: 'app-employee-list',
    templateUrl: 'employee-list-layout.component.html',
    styleUrls: ['employee-list-layout.component.scss'],
    animations: [contentExpansionHorizontal],
})
export class EmployeeListLayoutComponent {
    @ViewChild(EmployeeFiltersComponent) public filters!: EmployeeFiltersComponent;

    protected filtersOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        public pageDataService: EmployeePageLazyLoadingService
    ) { }

    protected toggleFilters(): void {
        this.filtersOpened$.next(!this.filtersOpened$.value);
    }
}

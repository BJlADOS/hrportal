import { Component, Inject } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeRequestService } from '../../data/services/employee-request.service';
import { EMPLOYEE_LIST_PROVIDER } from '../../providers/employee-list.provider';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { BehaviorSubject } from 'rxjs';
import { EMPLOYEE_LIST_TOKEN } from '../../tokens/employee-list.token';
import { BufferSubject, contentExpansionHorizontal, IPage } from '../../../../../../../../lib';
import { IUser } from '../../../../../../../../common';
import { IEmployeeRequestParams } from '../../data/param-interfaces/employee-request-params.interface';

@Component({
    templateUrl: 'employee-list-layout.component.html',
    styleUrls: ['employee-list-layout.component.scss'],
    providers: [
        EmployeeService,
        EmployeeRequestService,
        EMPLOYEE_LIST_PROVIDER,
        EmployeeSearchService
    ],
    animations: [contentExpansionHorizontal],
})
export class EmployeeListLayoutComponent {
    protected filtersOpened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(@Inject(EMPLOYEE_LIST_TOKEN) protected employeeListBuffer: BufferSubject<IEmployeeRequestParams, IPage<IUser>>)
    { }

    protected toggleFilters(): void {
        this.filtersOpened$.next(!this.filtersOpened$.value);
    }
}

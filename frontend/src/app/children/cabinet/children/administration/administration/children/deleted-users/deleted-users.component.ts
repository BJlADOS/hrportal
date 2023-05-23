import { Component, OnInit } from '@angular/core';
import { EmployeeSearchService } from '../../../../own-department/children/employees/services/employee-search.service';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { EmployeeService } from '../../../../own-department/children/employees/services/employee.service';
import {
    EmployeeRequestService
} from '../../../../own-department/children/employees/data/services/employee-request.service';
import {
    EmployeePageLazyLoadingService
} from '../../../../own-department/children/employees/services/employee-page-lazy-loading.service';

@Component({
    selector: 'app-deleted-users',
    templateUrl: './deleted-users.component.html',
    styleUrls: ['./deleted-users.component.scss'],
    providers: [
        EmployeeService,
        EmployeeRequestService,
        EmployeeSearchService,
        EmployeePageLazyLoadingService,
    ],
})
export class DeletedUsersComponent implements OnInit {

    constructor(
        private _employeeSearchService: EmployeeSearchService,
    ) {
        this._employeeSearchService.setDefaultStatus(false);
        this._employeeSearchService.setFilters({});
    }

    public ngOnInit(): void {
    }

}

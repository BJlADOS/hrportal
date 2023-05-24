import { Component } from '@angular/core';
import { EmployeeService } from '../../../../own-department/children/employees/services/employee.service';
import {
    EmployeeRequestService
} from '../../../../own-department/children/employees/data/services/employee-request.service';
import { EmployeeSearchService } from '../../../../own-department/children/employees/services/employee-search.service';
import {
    EmployeePageLazyLoadingService
} from '../../../../own-department/children/employees/services/employee-page-lazy-loading.service';

@Component({
    selector: 'app-deleted-user-detail',
    templateUrl: './deleted-user-detail.component.html',
    styleUrls: ['./deleted-user-detail.component.scss'],
    providers: [
        EmployeeService,
        EmployeeRequestService,
        EmployeeSearchService,
        EmployeePageLazyLoadingService
    ],
})
export class DeletedUserDetailComponent {

    constructor() { }


}

import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeRequestService } from '../../data/services/employee-request.service';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';

@Component({
    template: `
    <router-outlet></router-outlet>
    `,
    providers: [
        EmployeeService,
        EmployeeRequestService,
        EmployeeSearchService,
        EmployeePageLazyLoadingService,
    ],
})
export class EmployeeLayoutComponent {
    constructor(
        public pageDataService: EmployeePageLazyLoadingService
    ) {
        pageDataService.addPage();
    }
}

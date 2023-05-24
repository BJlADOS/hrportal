import { Component } from '@angular/core';
import { EmployeeSearchService } from '../../services/employee-search.service';

@Component({
    selector: 'app-employee-list-main-layout',
    templateUrl: './employee-list-main-layout.component.html',
    styleUrls: ['./employee-list-main-layout.component.scss']
})
export class EmployeeListMainLayoutComponent {

    constructor(
        private _search: EmployeeSearchService,
    ) {
        this._search.setDefaultStatus(true);
    }


}

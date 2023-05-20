import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGenerator } from '../../../../../../../../lib';
import { FormGroup } from '@angular/forms';
import { EmployeeSearchService } from '../../services/employee-search.service';

@Component({
    selector: 'employee-search',
    templateUrl: './employee-search.component.html',
    styleUrls: ['./employee-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchComponent {

    public searchForm: FormGroup = this._form.getSearchForm();

    constructor(
        private _form: FormGenerator,
        private _employeeSearchService: EmployeeSearchService
    ) { }


    public search(): void {
        this._employeeSearchService.search(this.searchForm.value.search);
    }

    public reset(): void {
        this.searchForm = this._form.getSearchForm();
    }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BufferSubject, FormGenerator, IPage } from '../../../../../../../../lib';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { IUser } from '../../../../../../../../common';
import { EMPLOYEE_LIST_TOKEN } from '../../tokens/employee-list.token';
import { IEmployeeRequestParams } from '../../data/param-interfaces/employee-request-params.interface';

@Component({
    selector: 'employee-search',
    templateUrl: './employee-search.component.html',
    styleUrls: ['./employee-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeSearchComponent {

    public employees$: Observable<IPage<IUser> | null> = this.modelBuffer$.value$;

    public searchForm: FormGroup = this._form.getSearchForm();

    constructor(
        private _form: FormGenerator,
        private _employeeSearchService: EmployeeSearchService,
        @Inject(EMPLOYEE_LIST_TOKEN) protected modelBuffer$: BufferSubject<IEmployeeRequestParams, IPage<IUser>>
    ) { }


    public search(): void {
        this._employeeSearchService.search(this.searchForm.value.search);
    }

    public reset(): void {
        this.searchForm = this._form.getSearchForm();
    }
}

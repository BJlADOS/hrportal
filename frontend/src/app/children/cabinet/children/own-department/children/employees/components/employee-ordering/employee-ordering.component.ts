import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
    DestroyService,
    FormGenerator,
    ISelectOption,
    Ordering
} from '../../../../../../../../lib';
import { getOrderingRussianAsArray } from '../../../../../../../../lib/utils/enum-mappers/ordering-russian-array-mapper';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'employee-ordering',
    templateUrl: 'employee-ordering.component.html',
    styleUrls: ['employee-ordering.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        DestroyService
    ]
})
export class EmployeeOrderingComponent implements OnInit {
    public orderingForm: FormGroup = this._form.getOrderingForm();
    public ordering: ISelectOption[] = getOrderingRussianAsArray();

    constructor(
        private _form: FormGenerator,
        private _employeeSearchService: EmployeeSearchService,
        private _destroyService$: DestroyService
    ) { }

    public ngOnInit(): void {
        this.orderingForm.controls['ordering'].valueChanges
            .pipe(
                takeUntil(this._destroyService$)
            )
            .subscribe((value: ISelectOption) => {
                this._employeeSearchService.sort(value.id as Ordering);
            });
    }
}

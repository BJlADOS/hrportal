import { Component } from '@angular/core';
import { Modal } from '../../../../../../../../../lib';
import { EmployeeDetailViewModel } from '../../../view-models/employee-detail.view-model';
import { IInputError } from '../../../../../../../../../common';
import { finalize } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeRequestService } from '../../../data/services/employee-request.service';

@Component({
    selector: 'app-delete-employee',
    templateUrl: './delete-employee.component.html',
    styleUrls: ['./delete-employee.component.scss'],
    providers: [EmployeeService, EmployeeRequestService],
})
export class DeleteEmployeeComponent extends Modal {

    public employee!: EmployeeDetailViewModel;
    public isLoading: boolean = false;
    public error: IInputError = { message: '' };
    public submitted: boolean = false;

    constructor(
        private _employeeService: EmployeeService,
    ) {
        super();
    }

    public onInjectInputs(inputs: any): void {
        this.employee = inputs.employee;
    }

    public deleteEmployee(): void {
        this.isLoading = true;
        this._employeeService.deleteEmployee(this.employee.id)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.submitted = true;
                },
                error: () => {
                    this.error.message = 'Ошибка удаления вакансии';
                }
            });
    }


}

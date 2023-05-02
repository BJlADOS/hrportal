import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from '../../../../../../../../common';
import { ModalService } from '../../../../../../../../lib';
import { EmployeeListItemViewModel } from '../../view-models/employee-list-item.view-model';

@Component({
    selector: 'employee-card',
    templateUrl: './employee-card.component.html',
    styleUrls: ['./employee-card.component.scss']
})
export class EmployeeCardComponent  {
    @Input()
    public set employeeData(data: IUser) {
        this.viewModel = new EmployeeListItemViewModel(data);
    }

    public viewModel!: EmployeeListItemViewModel;

    constructor(
        private _router: Router,
        private _modal: ModalService,
    ) { }

    public openEmployeeDetail(): void {
        // this._router.navigate([`cabinet/resumes/${this.employeeData.id}`]);
    }

    public toResume(): void {
        // this._modal.open(ResumeResponseModalComponent, {
        //     resume: this.employeeData,
        //     employeeName: this.user?.fullname,
        //     employeeEmail: this.user?.email,
        // });
        // this._resume.responseToResume(this.employeeData!.id);
    }
}

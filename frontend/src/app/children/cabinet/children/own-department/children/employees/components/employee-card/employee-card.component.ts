import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, ResumeService } from '../../../../../../../../common';
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
        this._model = data;
    }

    public viewModel!: EmployeeListItemViewModel;
    private _model!: IUser;

    constructor(
        private _router: Router,
        private _modal: ModalService,
        private _resumeService: ResumeService,
        private _activatedRoute: ActivatedRoute
    ) { }

    public openEmployeeDetail(event?: Event): void {
        event?.stopPropagation();
        this._router.navigate([`./${this.viewModel.userId}`], { relativeTo: this._activatedRoute });
    }

    public toResume(event?: Event): void {
        event?.stopPropagation();
        this._router.navigate([`cabinet/resumes/${this.viewModel.resumeId}`]);
    }
}

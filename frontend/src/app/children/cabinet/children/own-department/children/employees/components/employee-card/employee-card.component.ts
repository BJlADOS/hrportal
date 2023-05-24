import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {IUser, ResumeService, UserService} from '../../../../../../../../common';
import { ModalService } from '../../../../../../../../lib';
import { EmployeeListItemViewModel } from '../../view-models/employee-list-item.view-model';
import {DeleteEmployeeComponent} from "../modals/delete-employee/delete-employee.component";
import {finalize, Observable} from "rxjs";

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
    @Output() public userEdited: EventEmitter<void> = new EventEmitter<void>();

    public viewModel!: EmployeeListItemViewModel;
    public user$: Observable<IUser | null> = this._user.currentUser$;
    private _model!: IUser;

    constructor(
        private _router: Router,
        private _modal: ModalService,
        private _resumeService: ResumeService,
        private _activatedRoute: ActivatedRoute,
        private _user: UserService,
    ) { }

    public openEmployeeDetail(event?: Event): void {
        event?.stopPropagation();
        this._router.navigate([`./${this.viewModel.userId}`], { relativeTo: this._activatedRoute });
    }

    public toResume(event?: Event): void {
        event?.stopPropagation();
        this._router.navigate([`cabinet/resumes/${this.viewModel.resumeId}`]);
    }

    public deleteEmployee(viewModel: EmployeeListItemViewModel,event?: Event): void {
        event?.stopPropagation();
        this._modal.open(DeleteEmployeeComponent, { employee: viewModel })
            .onResult()
            .pipe(finalize(() => this.userEdited.emit()))
            .subscribe();
    }
}

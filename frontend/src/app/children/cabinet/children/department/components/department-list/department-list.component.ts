import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartmentService, IDepartment, UserService } from '../../../../../../common';
import { CreateDepartmentModalComponent } from '../create-department-modal/create-department-modal.component';
import { ModalService } from '../../../../../../lib';


@Component({
    selector: 'department-list',
    templateUrl: './department-list.component.html',
    styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

    public departments$: Observable<IDepartment[]> = this._departments.departments$;
    public loadingError: string | undefined;
    public user$ = this._user.currentUser$;

    constructor(
        private _departments: DepartmentService,
        private _modal: ModalService,
        private _user: UserService,
    ) { }

    public ngOnInit(): void {
    }


    public createDepartment(): void {
        this._modal.open(CreateDepartmentModalComponent);
    }

}

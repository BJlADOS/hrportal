import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from 'src/app/interfaces/User';
import { CreateDepartmentModalComponent } from '../create-department-modal/create-department-modal.component';
import { DepartmentService } from '../../../../../../services/department.service';
import { UserService } from '../../../../../../services/user.service';
import { ModalService } from '../../../../../../services/modal.service';


@Component({
    selector: 'app-departments',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

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

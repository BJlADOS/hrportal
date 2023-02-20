import { Component, Input, OnInit } from '@angular/core';
import { IDepartment, IUser } from 'src/app/interfaces/User';
import { ArchiveDepartmentModalComponent } from '../archive-department-modal/archive-department-modal.component';
import { EditDepartmentModalComponent } from '../edit-department-modal/edit-department-modal.component';
import { UserService } from '../../../../../../services/user.service';
import { ModalService } from '../../../../../../services/modal.service';

@Component({
    selector: 'app-department',
    templateUrl: './department.component.html',
    styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

    @Input() public department!: IDepartment;

    public managerName: string = '';

    constructor(
        private _user: UserService,
        private _modal: ModalService,
    ) { }

    public ngOnInit(): void {
        this._user.getUserById(this.department.managerId).subscribe({
            next: (manager: IUser) => {
                this.managerName = manager.fullname;
            }, error: (err) => {
                this.managerName = 'Error: ' + err;
            }
        });
    }

    public editDepartment(): void {
        this._modal.open(EditDepartmentModalComponent, { department: this.department });
    }

    public archiveDepartment(): void {
        this._modal.open(ArchiveDepartmentModalComponent, { department: this.department });
    }
}

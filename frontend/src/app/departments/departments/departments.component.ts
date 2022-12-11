import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IDepartment } from 'src/app/interfaces/User';
import { DepartmentService } from 'src/app/services/department/department.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { CreateDepartmentModalComponent } from '../create-department-modal/create-department-modal.component';


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

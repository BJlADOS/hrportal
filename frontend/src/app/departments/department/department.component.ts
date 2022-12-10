import { Component, Input, OnInit } from '@angular/core';
import { IDepartment, IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user/user.service';

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
    console.log('editDepartment()');
  }

  public archiveDepartment(): void {
    console.log('archiveDepartment()');
  }
}

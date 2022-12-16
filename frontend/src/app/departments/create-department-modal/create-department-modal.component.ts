import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { Modal } from 'src/app/classes/modal/modal';
import { IDepartmentFormError } from 'src/app/interfaces/errors';
import { ISelectOption } from 'src/app/interfaces/select';
import { IDepartment, IDepartmentUpdate, IUser } from 'src/app/interfaces/User';
import { DepartmentService } from 'src/app/services/department/department.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-department-modal',
  templateUrl: './create-department-modal.component.html',
  styleUrls: ['./create-department-modal.component.scss'],
  animations: [contentExpansion],
})
export class CreateDepartmentModalComponent extends Modal implements OnInit {

  public departmentForm: FormGroup = this._form.getDepartmentForm(null);
  public departmentName: string = '';
  public users: ISelectOption[] = [];
  public submitError: string | undefined;

  public isSubmitted: boolean = false;
  public errors: IDepartmentFormError = { name: null, manager: null };

  private _formManager: FormManager = FormManager.getInstance();

  constructor(
    private _form: FormGenerator,
    private _user: UserService,
    private _department: DepartmentService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this._user.getUsers().subscribe((users: IUser[]) => {
      const usersFiltered = users.filter((user: IUser) => !(user.isManager || user.isAdmin));
      this.users = usersFiltered.map((user: IUser) => {
        return { id: user.id.toString(), name: user.fullname };
      });
    });
  }

  public onInjectInputs(inputs: any): void {
    
  }

  public createDepartment(): void {
    const department = this.createUpdateObject();

    this._department.createDepartment(department).subscribe({ next: (department: IDepartment) => {
      this.departmentName = department.name;
      this._department.getDepartments();
      this.isSubmitted = true;
    }, error: (error: any) => {
      this.submitError = 'Ошибка создания департамента'
    }
    });
  }

  public departmentNameChange(): void {
    this.errors.name = this._formManager.checkDepartmentName(this.departmentForm);
  }

  public cancel(): void {
    this.close();
  }

  private createUpdateObject(): IDepartmentUpdate {
    const form = this.departmentForm.value;
    return {
      name: form.departmentName,
      managerId: form.managerId,
    }
  }

}

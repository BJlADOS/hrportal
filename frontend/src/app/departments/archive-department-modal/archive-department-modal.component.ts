import { Component, OnInit } from '@angular/core';
import { Modal } from 'src/app/classes/modal/modal';
import { IDepartment } from 'src/app/interfaces/User';
import { DepartmentService } from 'src/app/services/department/department.service';

@Component({
  selector: 'app-archive-department-modal',
  templateUrl: './archive-department-modal.component.html',
  styleUrls: ['./archive-department-modal.component.scss']
})
export class ArchiveDepartmentModalComponent extends Modal implements OnInit {

  public department!: IDepartment;

  constructor(
    private _department: DepartmentService,
  ) {
    super();
   }

  public ngOnInit(): void {
  }

  public onInjectInputs(inputs: any): void {
    this.department = inputs.department;
  }

  public archiveDepartment(): void {
    console.log('archiveDepartment()');
  }

  public cancelArchive(): void {
    this.close();
  }

}

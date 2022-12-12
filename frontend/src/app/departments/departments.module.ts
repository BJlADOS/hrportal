import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsMainComponent } from './departments-main/departments-main.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { departmentsRouting } from './departments-routing.module';
import { CreateDepartmentModalComponent } from './create-department-modal/create-department-modal.component';
import { EditDepartmentModalComponent } from './edit-department-modal/edit-department-modal.component';
import { ArchiveDepartmentModalComponent } from './archive-department-modal/archive-department-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DepartmentsMainComponent,
    DepartmentsComponent,
    DepartmentComponent,
    CreateDepartmentModalComponent,
    EditDepartmentModalComponent,
    ArchiveDepartmentModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    departmentsRouting,
    ReactiveFormsModule,
  ]
})
export class DepartmentsModule { }

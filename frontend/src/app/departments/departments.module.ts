import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsMainComponent } from './departments-main/departments-main.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { departmentsRouting } from './departments-routing.module';



@NgModule({
  declarations: [
    DepartmentsMainComponent,
    DepartmentsComponent,
    DepartmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    departmentsRouting,
  ]
})
export class DepartmentsModule { }

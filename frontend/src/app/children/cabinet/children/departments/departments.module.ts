import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepartmentsComponent } from './components/departments/departments.component';
import { DepartmentComponent } from './components/department/department.component';
import { CreateDepartmentModalComponent } from './components/create-department-modal/create-department-modal.component';
import { RouterModule } from '@angular/router';
import { EditDepartmentModalComponent } from './components/edit-department-modal/edit-department-modal.component';
import { SharedModule } from '../../../../lib/shared/shared.module';
import {
    ArchiveDepartmentModalComponent
} from './components/archive-department-modal/archive-department-modal.component';
import { departmentsRouting } from './departments-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
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

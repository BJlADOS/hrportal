import { NgModule } from '@angular/core';
import {
    ArchiveDepartmentModalComponent,
    CreateDepartmentModalComponent,
    DepartmentComponent,
    DepartmentListComponent,
    EditDepartmentModalComponent
} from './components';
import { RouterModule } from '@angular/router';
import { departmentRouting } from './department-routing.module';
import { SharedModule } from '../../../../lib';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CrossIconComponent, SuccessIconComponent, Edit1IconComponent, Archive1IconComponent } from '../../../../../assets/img';

@NgModule({
    declarations: [
        DepartmentListComponent,
        DepartmentComponent,
        CreateDepartmentModalComponent,
        EditDepartmentModalComponent,
        ArchiveDepartmentModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        departmentRouting,
        ReactiveFormsModule,
        CrossIconComponent,
        SuccessIconComponent,
        Edit1IconComponent,
        Archive1IconComponent
    ]
})
export class DepartmentModule { }

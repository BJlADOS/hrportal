import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRouting } from './profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent, ResumeComponent } from './components';
import { SharedModule } from '../../../../lib';
import { SuccessIconComponent, CheckStaticIconComponent, PlusIconComponent, Cross2IconComponent, EditWhiteIconComponent } from '../../../../../assets/img';
import {
    GradeFormComponent
} from "../own-department/children/employees/components/employee-detail/components/grade-form/grade-form.component";


@NgModule({
    declarations: [
        ProfileComponent,
        ResumeComponent,
    ],
    imports: [
        CommonModule,
        profileRouting,
        SharedModule,
        ReactiveFormsModule,
        SuccessIconComponent,
        CheckStaticIconComponent,
        PlusIconComponent,
        Cross2IconComponent,
        EditWhiteIconComponent,
        GradeFormComponent
    ]
})
export class ProfileModule { }

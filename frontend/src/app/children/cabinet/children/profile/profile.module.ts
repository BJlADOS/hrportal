import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRouting } from './profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ProfileComponent, ResumeComponent } from './components';



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
    ]
})
export class ProfileModule { }

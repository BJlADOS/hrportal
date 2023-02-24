import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRouting } from './profile-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent, ResumeComponent } from './components';
import { SharedModule } from '../../../../lib';


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

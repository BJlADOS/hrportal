import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ResumeComponent } from './resume/resume.component';
import { profileRouting } from './profile-routing.module';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfileComponent,
    ResumeComponent,
    ProfileMainComponent,
  ],
  imports: [
    CommonModule,
    profileRouting,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }

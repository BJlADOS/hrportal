import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ResumeComponent } from './resume/resume.component';
import { profileRouting } from './profile-routing.module';



@NgModule({
  declarations: [
    ProfileComponent,
    ResumeComponent
  ],
  imports: [
    CommonModule,
    profileRouting,
  ]
})
export class ProfileModule { }

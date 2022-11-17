import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ResumeComponent } from './resume/resume.component';
import { profileRouting } from './profile-routing.module';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from './select/select.component';
import { SelectWithSearchComponent } from './select-with-search/select-with-search.component';
import {ScrollingModule} from '@angular/cdk/scrolling';



@NgModule({
  declarations: [
    ProfileComponent,
    ResumeComponent,
    ProfileMainComponent,
    SelectComponent,
    SelectWithSearchComponent,
  ],
  imports: [
    CommonModule,
    profileRouting,
    SharedModule,
    ReactiveFormsModule,
    ScrollingModule,
  ]
})
export class ProfileModule { }

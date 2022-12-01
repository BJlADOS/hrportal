import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeMainComponent } from './resume-main/resume-main.component';
import { ResumeListComponent } from './resume-list/resume-list.component';
import { ResumeDetailComponent } from './resume-detail/resume-detail.component';
import { SharedModule } from '../shared/shared.module';
import { resumeRouting } from './resume-routing.module';
import { ResumeComponent } from './resume/resume.component';
import { ResumeResponseModalComponent } from './resume-response-modal/resume-response-modal.component';



@NgModule({
  declarations: [
    ResumeMainComponent,
    ResumeListComponent,
    ResumeDetailComponent,
    ResumeComponent,
    ResumeResponseModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    resumeRouting,
  ]
})
export class ResumeModule { }

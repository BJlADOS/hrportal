import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resumeRouting } from './resume-routing.module';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ResumeComponent, ResumeDetailComponent, ResumeListComponent, ResumeResponseModalComponent } from './components';
import { ResumeResolverService, ResumeService } from './services';

@NgModule({
    declarations: [
        ResumeListComponent,
        ResumeDetailComponent,
        ResumeComponent,
        ResumeResponseModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        resumeRouting,
    ],
    providers: [
        ResumeService,
        ResumeResolverService
    ]
})
export class ResumeModule { }

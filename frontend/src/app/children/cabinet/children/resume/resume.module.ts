import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resumeRouting } from './resume-routing.module';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ResumeComponent, ResumeDetailComponent, ResumeListComponent, ResumeResponseModalComponent } from './components';
import { ResumeResolverService, ResumeService } from '../../../../common';
import { CrossIconComponent, SuccessIconComponent } from '../../../../../assets/img';


@NgModule({
    declarations: [
        ResumeListComponent,
        ResumeDetailComponent,
        ResumeComponent,
        ResumeResponseModalComponent
    ],
    providers: [
        ResumeService,
        ResumeResolverService
    ],
    imports: [
        CommonModule,
        SharedModule,
        resumeRouting,
        CrossIconComponent,
        SuccessIconComponent
    ]
})
export class ResumeModule { }

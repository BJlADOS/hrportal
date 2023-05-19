import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resumeRouting } from './resume-routing.module';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ResumeDetailComponent, ResumeListMainComponent, ResumeResponseModalComponent } from './components';
import { ResumeResolverService, ResumeService } from '../../../../common';
import {
    Cross1IconComponent,
    CrossIconComponent,
    FilterIconComponent, MagnifierIconComponent,
    SuccessIconComponent, UpArrowIconComponent
} from '../../../../../assets/img';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import {
    ResumeCardComponent,
    ResumeFiltersComponent,
    ResumeListComponent,
    ResumeSearchComponent
} from './components/shared';



@NgModule({
    declarations: [
        ResumeListMainComponent,
        ResumeDetailComponent,
        ResumeResponseModalComponent,
        ResumeListComponent,
        ResumeCardComponent,
        ResumeFiltersComponent,
        ResumeSearchComponent,
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
        SuccessIconComponent,
        NgxStickySidebarModule,
        ReactiveFormsModule,
        NgxMaskModule,
        Cross1IconComponent,
        FilterIconComponent,
        MagnifierIconComponent,
        UpArrowIconComponent
    ],
    exports: [
        ResumeListComponent,
        ResumeCardComponent,
        ResumeFiltersComponent,
        ResumeSearchComponent,
    ]
})
export class ResumeModule { }

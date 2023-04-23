import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { resumeRouting } from './resume-routing.module';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ResumeComponent, ResumeDetailComponent, ResumeListComponent, ResumeResponseModalComponent } from './components';
import { ResumeResolverService, ResumeService } from '../../../../common';
import {
    Cross1IconComponent,
    CrossIconComponent,
    FilterIconComponent, MagnifierIconComponent,
    SuccessIconComponent, UpArrowIconComponent
} from '../../../../../assets/img';
import {NgxStickySidebarModule} from "@smip/ngx-sticky-sidebar";
import { ResumeFiltersComponent } from './components/resume-filters/resume-filters.component';
import {ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from "ngx-mask";
import { ResumeSearchComponent } from './components/resume-search/resume-search.component';


@NgModule({
    declarations: [
        ResumeListComponent,
        ResumeDetailComponent,
        ResumeComponent,
        ResumeResponseModalComponent,
        ResumeFiltersComponent,
        ResumeSearchComponent
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
    ]
})
export class ResumeModule { }

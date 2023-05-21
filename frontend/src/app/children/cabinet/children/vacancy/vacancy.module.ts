import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { NgxMaskModule } from 'ngx-mask';
import {
    CreateVacancyComponent,
    UploadModalComponent, VacancyListMainComponent,
    VacancyDetailComponent
} from './components';
import { vacancyRouting } from './vacancy-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { VacanciesSearchService, VacancyDeclinationPipe, VacancyResolverService } from '../../../../common';
import { PlusIconComponent, Cross2IconComponent, MagnifierIconComponent, Cross1IconComponent, FilterIconComponent, CrossIconComponent, UploadIconComponent, SuccessIconComponent, EditIconComponent, ArchiveIconComponent, UpArrowIconComponent } from '../../../../../assets/img';
import { VacancyCardComponent } from './components';
import { VacancyFiltersComponent } from './components';
import { VacancyListComponent } from './components';
import { VacancySearchComponent } from './components';
import {RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        VacancyListMainComponent,
        VacancyDetailComponent,
        UploadModalComponent,
        CreateVacancyComponent,
        VacancyCardComponent,
        VacancyFiltersComponent,
        VacancyListComponent,
        VacancySearchComponent,
        VacancyDeclinationPipe,
    ],
    exports: [
        VacancyListComponent
    ],
    providers: [
        VacanciesSearchService,
        VacancyResolverService
    ],
    imports: [
        CommonModule,
        vacancyRouting,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskModule.forChild(),
        EditorModule,
        NgxStickySidebarModule.withConfig({
            minWidth: '280px',
        }),
        PlusIconComponent,
        Cross2IconComponent,
        MagnifierIconComponent,
        Cross1IconComponent,
        FilterIconComponent,
        CrossIconComponent,
        UploadIconComponent,
        SuccessIconComponent,
        EditIconComponent,
        ArchiveIconComponent,
        UpArrowIconComponent
    ],
    exports: [
        VacancyListComponent,
        VacancySearchComponent,
        VacancyCardComponent,
        VacancyFiltersComponent,
    ],
})
export class VacancyModule { }

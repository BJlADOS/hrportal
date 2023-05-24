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
import { ArchiveVacancyComponent } from './components/modals/archive-vacancy/archive-vacancy.component';
import { DeleteVacancyComponent } from './components/modals/delete-vacancy/delete-vacancy.component';
import { RemoveFromArchiveComponent } from './components/modals/remove-from-archive/remove-from-archive.component';


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
        ArchiveVacancyComponent,
        DeleteVacancyComponent,
        RemoveFromArchiveComponent,
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

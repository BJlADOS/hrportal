import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { VacancyDeclinationPipe } from './pipes';
import { NgxMaskModule } from 'ngx-mask';
import {
    CreateVacancyComponent, FiltersComponent,
    SearchComponent,
    UploadModalComponent, VacanciesComponent,
    VacancyComponent,
    VacancyDetailComponent
} from './components';
import { vacanciesRouting } from './vacancies-routing.module';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {
    VacanciesSearchService,
    VacancyResolverService
} from './services';


@NgModule({
    declarations: [
        VacanciesComponent,
        VacancyComponent,
        VacancyDetailComponent,
        UploadModalComponent,
        CreateVacancyComponent,
        SearchComponent,
        FiltersComponent,
        VacancyDeclinationPipe,
    ],
    imports: [
        CommonModule,
        vacanciesRouting,
        SharedModule,
        ReactiveFormsModule,
        NgxMaskModule.forChild(),
        EditorModule,
        NgxStickySidebarModule.withConfig({
            minWidth: '280px',
        }),
    ],
    providers: [
        VacanciesSearchService,
        VacancyResolverService
    ]
})
export class VacanciesModule { }

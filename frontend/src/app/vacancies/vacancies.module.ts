import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacancyComponent } from './vacancy/vacancy.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { vacanciesRouting } from './vacancies-routing.module';
import { VacanciesMainComponent } from './vacancies-main/vacancies-main.component';
import { SharedModule } from '../shared/shared.module';
import { VacancyDetailComponent } from './vacancy-detail/vacancy-detail.component';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragAndDropDirective } from './directives/drag-and-drop/drag-and-drop.directive';



@NgModule({
  declarations: [
    VacanciesComponent,
    VacancyComponent,
    VacanciesMainComponent,
    VacancyDetailComponent,
    UploadModalComponent,
    DragAndDropDirective,
  ],
  imports: [
    CommonModule,
    vacanciesRouting,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class VacanciesModule { }

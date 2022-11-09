import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacancyComponent } from './vacancy/vacancy.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { vacanciesRouting } from './vacancies-routing.module';
import { VacanciesMainComponent } from './vacancies-main/vacancies-main.component';
import { SharedModule } from '../shared/shared.module';
import { VacancyDetailComponent } from './vacancy-detail/vacancy-detail.component';



@NgModule({
  declarations: [
    VacanciesComponent,
    VacancyComponent,
    VacanciesMainComponent,
    VacancyDetailComponent
  ],
  imports: [
    CommonModule,
    vacanciesRouting,
    SharedModule,
  ]
})
export class VacanciesModule { }

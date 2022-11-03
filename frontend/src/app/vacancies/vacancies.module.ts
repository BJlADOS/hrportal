import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacancyComponent } from './vacancy/vacancy.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { vacanciesRouting } from './vacancies-routing.module';



@NgModule({
  declarations: [
    VacanciesComponent,
    VacancyComponent
  ],
  imports: [
    CommonModule,
    vacanciesRouting,
  ]
})
export class VacanciesModule { }

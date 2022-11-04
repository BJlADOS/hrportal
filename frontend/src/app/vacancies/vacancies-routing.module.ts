import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacanciesMainComponent } from './vacancies-main/vacancies-main.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { VacancyComponent } from './vacancy/vacancy.component';



const routes: Routes = [
    {path: '', component: VacanciesMainComponent, children: [
        { path: '', component: VacanciesComponent, pathMatch: 'full' },
        { path: ':id', component: VacancyComponent, pathMatch: 'full' },
    ]},    
];

export const vacanciesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

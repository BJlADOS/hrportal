import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacancyResolverService } from '../services/vacancy-resolver/vacancy-resolver.service';
import { CreateVacancyComponent } from './create-vacancy/create-vacancy.component';
import { VacanciesMainComponent } from './vacancies-main/vacancies-main.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { VacancyDetailComponent } from './vacancy-detail/vacancy-detail.component';

const routes: Routes = [
    { path: '', component: VacanciesMainComponent, data: { breadcrumb: 'Вакансии' }, children: [
        { path: '', component: VacanciesComponent, pathMatch: 'full', data: { breadcrumb: null } },  
        { path: 'create', component: CreateVacancyComponent, pathMatch: 'full', data: { breadcrumb: 'Создать вакансию' } },
        { path: ':id', component: VacancyDetailComponent, pathMatch: 'full', resolve: { breadcrumb: VacancyResolverService } },      
    ]},    
];

export const vacanciesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

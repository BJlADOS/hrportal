import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacancyResolverService } from '../services/vacancy-resolver/vacancy-resolver.service';
import { VacanciesMainComponent } from './vacancies-main/vacancies-main.component';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { VacancyDetailComponent } from './vacancy-detail/vacancy-detail.component';

const routes: Routes = [
    { path: '', component: VacanciesMainComponent, data: { breadcrumb: 'Вакансии' }, children: [
        { path: '', component: VacanciesComponent, pathMatch: 'full', data: { breadcrumb: null } },  
        { path: ':id', component: VacancyDetailComponent, pathMatch: 'full', resolve: { breadcrumb: VacancyResolverService }},    
    ]},    
];

export const vacanciesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateVacancyComponent, VacanciesComponent, VacancyDetailComponent } from './components';
import { VacancyResolverService } from './services/vacancy-resolver.service';

const routes: Routes = [
    {
        path: '',
        component: VacanciesComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: null
        }
    },
    {
        path: 'create',
        component: CreateVacancyComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Создать вакансию'
        }
    },
    {
        path: ':id',
        component: VacancyDetailComponent,
        pathMatch: 'full',
        resolve: {
            breadcrumb: VacancyResolverService
        }
    },
];

export const vacanciesRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

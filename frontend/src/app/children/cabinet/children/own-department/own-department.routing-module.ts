import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnDepartmentLayoutComponent } from './components/own-department-layout/own-department-layout.component';

const routes: Routes = [
    {
        path: '',
        component: OwnDepartmentLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'employees',
                pathMatch: 'full'
            },
            {
                path: 'vacancies',
                loadChildren: () => import('../vacancy/vacancy.module').then((m) => m.VacancyModule),
                data: {
                    breadcrumb: 'Вакансии'
                }
            },
            {
                path: 'resumes',
                loadChildren: () => import('../resume/resume.module').then((m) => m.ResumeModule),
                data: {
                    breadcrumb: 'Резюме'
                }
            },
            {
                path: 'employees',
                loadChildren: () => import('./children/employees/own-department-employees.module').then((m) => m.OwnDepartmentEmployeesModule),
                data: {
                    breadcrumb: 'Сотрудники'
                }
            }
        ]
    }
];

export const ownDepartmentRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

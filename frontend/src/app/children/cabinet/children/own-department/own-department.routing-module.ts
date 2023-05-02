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
                loadChildren: () => import('./children/employees/own-department-employees.module').then((m) => m.OwnDepartmentEmployeesModule),
                data: {
                    breadcrumb: 'Вакансии'
                }
            },
            {
                path: 'resumes',
                loadChildren: () => import('./children/employees/own-department-employees.module').then((m) => m.OwnDepartmentEmployeesModule),
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
            },
            {
                path: 'responses',
                loadChildren: () => import('./children/employees/own-department-employees.module').then((m) => m.OwnDepartmentEmployeesModule),
                data: {
                    breadcrumb: 'Отклики'
                }
            },
        ]
    }
];

export const ownDepartmentRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

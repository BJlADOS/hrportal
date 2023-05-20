import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListLayoutComponent } from './components/employee-list-layout/employee-list-layout.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeLayoutComponent,
        children: [
            {
                path: '',
                component: EmployeeListLayoutComponent,
            },
            {
                path: ':id',
                component: EmployeeDetailComponent,
                data: {
                    breadcrumbs: 'Сотрудник'
                }
            }
        ]
    }
];

export const ownDepartmentEmployeeRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

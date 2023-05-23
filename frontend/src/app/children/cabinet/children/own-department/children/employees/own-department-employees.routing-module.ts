import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';
import {
    EmployeeListMainLayoutComponent
} from './components/employee-list-main-layout/employee-list-main-layout.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeLayoutComponent,
        children: [
            {
                path: '',
                component: EmployeeListMainLayoutComponent,
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

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentComponent, DepartmentListComponent } from './components';

const routes: Routes = [
    {
        path: '',
        component: DepartmentListComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Департаменты'
        },
        children: [
            {
                path: ':id',
                component: DepartmentComponent,
                pathMatch: 'full',
                data: {
                    breadcrumb: 'Резюме'
                }
            },
        ]
    }
];

export const departmentRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

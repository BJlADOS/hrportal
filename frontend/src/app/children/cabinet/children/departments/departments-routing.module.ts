import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentsComponent } from './components/departments/departments.component';
import { DepartmentComponent } from './components/department/department.component';

const routes: Routes = [
    {
        path: '',
        component: DepartmentsComponent,
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

export const departmentsRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

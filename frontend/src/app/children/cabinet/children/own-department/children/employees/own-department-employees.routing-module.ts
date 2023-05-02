import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListLayoutComponent } from './components/employee-list-layout/employee-list-layout.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeeListLayoutComponent
    }
];

export const ownDepartmentRoutes: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

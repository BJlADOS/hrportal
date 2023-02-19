import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent, ResumeComponent } from './components';


const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Профиль'
        },
        children: [
            {
                path: 'resume',
                component: ResumeComponent,
                pathMatch: 'full',
                data: {
                    breadcrumb: 'Резюме'
                }
            },
        ]
    },
];

export const profileRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

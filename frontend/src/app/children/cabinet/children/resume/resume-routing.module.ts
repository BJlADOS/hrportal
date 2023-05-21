import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeDetailComponent, ResumeListMainComponent } from './components';
import { ResumeResolverService } from '../../../../common';

const routes: Routes = [
    {
        path: '',
        component: ResumeListMainComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: null
        }
    },
    {
        path: ':id',
        component: ResumeDetailComponent,
        pathMatch: 'full',
        resolve: {
            breadcrumb: ResumeResolverService
        }
    },
];

export const resumeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

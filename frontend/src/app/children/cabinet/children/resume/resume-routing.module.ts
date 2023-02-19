import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeResolverService } from './services';
import { ResumeDetailComponent, ResumeListComponent } from './components';

const routes: Routes = [
    {
        path: '',
        component: ResumeListComponent,
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

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeResolverService } from '../services/resume-resolver/resume-resolver.service';
import { ResumeDetailComponent } from './resume-detail/resume-detail.component';
import { ResumeListComponent } from './resume-list/resume-list.component';
import { ResumeMainComponent } from './resume-main/resume-main.component';

const routes: Routes = [
    { path: '', component: ResumeMainComponent, data: { breadcrumb: 'Резюме' }, children: [
        { path: '', component: ResumeListComponent, pathMatch: 'full', data: { breadcrumb: null } },  
        { path: ':id', component: ResumeDetailComponent, pathMatch: 'full', resolve: { breadcrumb: ResumeResolverService }},    
    ]},    
];

export const resumeRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

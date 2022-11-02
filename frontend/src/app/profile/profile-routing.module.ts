import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ResumeComponent } from './resume/resume.component';



const routes: Routes = [
    { path: '', component: ProfileComponent, pathMatch: 'full' },
    { path: '/resume', component: ResumeComponent, pathMatch: 'full' },
];

export const profileRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

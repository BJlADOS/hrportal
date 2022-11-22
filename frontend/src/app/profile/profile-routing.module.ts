import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMainComponent } from './profile-main/profile-main.component';
import { ProfileComponent } from './profile/profile.component';
import { ResumeComponent } from './resume/resume.component';



const routes: Routes = [
    { path: '', component: ProfileMainComponent ,children: [
        { path: '', component: ProfileComponent, pathMatch: 'full', data: { breadcrumb: 'Профиль'}, children: [
            { path: 'resume', component: ResumeComponent, pathMatch: 'full', data: { breadcrumb: 'Резюме' } },
        ] },         
    ]},

];

export const profileRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

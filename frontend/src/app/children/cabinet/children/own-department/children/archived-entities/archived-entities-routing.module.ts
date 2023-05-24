import { RouterModule, Routes } from '@angular/router';
import {ModuleWithProviders, NgModule} from '@angular/core';
import { ArchivedLayoutComponent } from './components/archived-layout/archived-layout.component';
import { ArchivedVacanciesComponent } from './components/archived-vacancies/archived-vacancies.component';
import { ArchivedResumesComponent } from './components/archived-resumes/archived-resumes.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'lists',
        pathMatch: 'full'
    },
    {
        path: 'lists',
        component: ArchivedLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'archived-vacancies',
                pathMatch: 'full',
            },
            {
                path: 'archived-vacancies',
                component: ArchivedVacanciesComponent,
            },
            {
                path: 'archived-resumes',
                component: ArchivedResumesComponent,
            },
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArchivedEntitiesRoutingModule { }

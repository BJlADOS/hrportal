import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration/administration.component';
import { DeletedVacanciesComponent } from './administration/children/deleted-vacancies/deleted-vacancies.component';
import { DeletedResumesComponent } from './administration/children/deleted-resumes/deleted-resumes.component';
import { DeletedUsersComponent } from './administration/children/deleted-users/deleted-users.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'lists',
    },
    {
        path: 'lists',
        component: AdministrationComponent,
        data: {
            breadcrumb: 'Администрирование'
        },
        children: [
            {
                path: '',
                redirectTo: 'deleted-vacancies',
                pathMatch: 'full',
            },
            {
                path: 'deleted-vacancies',
                pathMatch: 'full',
                component: DeletedVacanciesComponent,
            },
            {
                path: 'deleted-resumes',
                pathMatch: 'full',
                component: DeletedResumesComponent,
            },
            {
                path: 'deleted-users',
                pathMatch: 'full',
                component: DeletedUsersComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }

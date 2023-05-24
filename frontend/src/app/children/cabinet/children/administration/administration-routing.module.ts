import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration/administration.component';
import { DeletedVacanciesComponent } from './administration/children/deleted-vacancies/deleted-vacancies.component';
import { DeletedResumesComponent } from './administration/children/deleted-resumes/deleted-resumes.component';
import { DeletedUsersComponent } from './administration/children/deleted-users/deleted-users.component';
import { DeletedUserDetailComponent } from './administration/children/deleted-user-detail/deleted-user-detail.component';

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
                data: {
                    breadcrumb: 'Удалённые вакансии'
                },
            },
            {
                path: 'deleted-resumes',
                pathMatch: 'full',
                component: DeletedResumesComponent,
                data: {
                    breadcrumb: 'Удалённые резюме'
                },
            },
            {
                path: 'deleted-users',
                pathMatch: 'full',
                component: DeletedUsersComponent,
                data: {
                    breadcrumb: 'Удалённые сотрудники'
                },
            },
        ],
    },
    {
        path:'lists/deleted-users/:id',
        component: DeletedUserDetailComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: 'Удалённый сотрудник'
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }

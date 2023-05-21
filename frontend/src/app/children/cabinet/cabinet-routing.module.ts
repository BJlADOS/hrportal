import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetLayoutComponent } from './components';
import { AdminGuard, ManagerGuard } from './guards';

const routes: Routes = [
    {
        path: '',
        component: CabinetLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'vacancies',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                loadChildren: () => import('./children/profile/profile.module').then((m: any) => m.ProfileModule)
            },
            {
                path: 'vacancies',
                loadChildren: () => import('./children/vacancy/vacancy.module').then((m: any) => m.VacancyModule),
                data: {
                    breadcrumb: 'Вакансии'
                }
            },
            {
                path: 'resumes',
                loadChildren: () => import('./children/resume/resume.module').then((m: any) => m.ResumeModule),
                canActivate: [ManagerGuard],
                data: {
                    breadcrumb: 'Резюме'
                },
            },
            {
                path: 'own-department',
                loadChildren: () => import('./children/own-department/own-department.module').then((m: any) => m.OwnDepartmentModule),
                data: {
                    breadcrumb: 'Мой департамент'
                },
            },
            {
                path: 'departments',
                loadChildren: () => import('./children/department/department.module').then((m: any) => m.DepartmentModule),
                canActivate: [AdminGuard]
            },
            {
                path: 'administration',
                loadChildren: () => import('./children/administration/administration.module').then(m => m.AdministrationModule),
                canActivate: [AdminGuard],
            }
        ],
        data: {
            breadcrumb: 'HR-портал'
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class CabinetRoutingModule {

}

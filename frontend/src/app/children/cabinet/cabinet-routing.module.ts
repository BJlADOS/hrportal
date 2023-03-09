import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetLayoutComponent } from './components/cabinet-layout/cabinet-layout.component';
import { ManagerGuard } from './guards/manager.guard';
import { AdminGuard } from './guards/admin.guard';

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
                loadChildren: () => import('./children/profile/profile.module').then(m => m.ProfileModule)
            },
            {
                path: 'vacancies',
                loadChildren: () => import('./children/vacancy/vacancy.module').then(m => m.VacancyModule),
                data: {
                    breadcrumb: 'Вакансии'
                }
            },
            {
                path: 'resumes',
                loadChildren: () => import('./children/resume/resume.module').then(m => m.ResumeModule),
                canActivate: [ManagerGuard],
                data: {
                    breadcrumb: 'Резюме'
                },
            },
            {
                path: 'departments',
                loadChildren: () => import('./children/department/department.module').then(m => m.DepartmentModule),
                canActivate: [AdminGuard]
            },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class CabinetRoutingModule {

}

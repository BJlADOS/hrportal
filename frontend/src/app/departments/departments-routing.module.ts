import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DepartmentComponent } from "./department/department.component";
import { DepartmentsMainComponent } from "./departments-main/departments-main.component";
import { DepartmentsComponent } from "./departments/departments.component";

const routes: Routes = [
    { path: '', component: DepartmentsMainComponent ,children: [
        { path: '', component: DepartmentsComponent, pathMatch: 'full', data: { breadcrumb: 'Департаменты'}, children: [
            { path: ':id', component: DepartmentComponent, pathMatch: 'full', data: { breadcrumb: 'Резюме' } },
        ] },         
    ]},

];

export const departmentsRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
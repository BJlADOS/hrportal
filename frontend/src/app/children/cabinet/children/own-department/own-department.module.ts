import { NgModule } from '@angular/core';
import { ownDepartmentRoutes } from './own-department.routing-module';
import { OwnDepartmentLayoutComponent } from './components/own-department-layout/own-department-layout.component';
import { AsyncPipe, NgIf } from '@angular/common';

@NgModule({
    imports: [
        ownDepartmentRoutes,
        AsyncPipe,
        NgIf
    ],
    declarations: [
        OwnDepartmentLayoutComponent
    ]
})
export class OwnDepartmentModule {

}

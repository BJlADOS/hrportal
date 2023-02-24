import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { CabinetLayoutComponent, HeaderComponent } from './components';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../lib';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { ResumeCreateModule } from '../../common';


@NgModule({
    declarations: [
        CabinetLayoutComponent,
        HeaderComponent,
        BreadcrumbComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        CabinetRoutingModule,
        ResumeCreateModule,
    ]
})
export class CabinetModule {

}

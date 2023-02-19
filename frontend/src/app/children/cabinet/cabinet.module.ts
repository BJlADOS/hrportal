import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetLayoutComponent } from './components/cabinet-layout/cabinet-layout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../lib/shared/shared.module';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { ResumeCreateModule } from './modules/resume-create/resume-create.module';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
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

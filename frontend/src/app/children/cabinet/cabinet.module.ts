import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetLayoutComponent, HeaderComponent } from './components';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../lib';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { ResumeCreateModule } from '../../common';
import {
    AppLogoIconComponent,
    CrossIconComponent,
    LogoutIconComponent,
    SettingsIconComponent
} from '../../../assets/img';
import {
    HeaderDropdownSelectorComponent
} from './components/ui-hover-selector/components/header-dropdown-selector/header-dropdown-selector.component';
import { UiBreadcrumbsComponent } from '../../lib/ui-breadcrumbs';


@NgModule({
    declarations: [
        CabinetLayoutComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        CabinetRoutingModule,
        ResumeCreateModule,
        AppLogoIconComponent,
        LogoutIconComponent,
        SettingsIconComponent,
        CrossIconComponent,
        HeaderDropdownSelectorComponent,
        UiBreadcrumbsComponent
    ]
})
export class CabinetModule {

}

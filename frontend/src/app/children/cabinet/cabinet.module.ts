import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetLayoutComponent, HeaderComponent } from './components';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../lib';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { ResumeCreateModule } from '../../common';
import {
    AccordionArrowIconComponent,
    AppLogoIconComponent,
    CrossIconComponent,
    LogoutIconComponent,
    SettingsIconComponent
} from '../../../assets/img';
import {
    HeaderDropdownSelectorComponent
} from './components/ui-hover-selector/components/header-dropdown-selector/header-dropdown-selector.component';
import { UiBreadcrumbsComponent } from '../../lib/ui-breadcrumbs';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationIconComponent } from '../../../assets/img/notification/notification-icon';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NotificationComponent } from './components/notifications/notification/notification.component';
import { ScrolledToBottomDirective } from '../../common/cabinet/directives/scrolled-to-bottom.directive';
import { LetDirective } from '../../lib/directives/let.directive';


@NgModule({
    declarations: [
        CabinetLayoutComponent,
        HeaderComponent,
        NotificationsComponent,
        NotificationComponent,
        ScrolledToBottomDirective,
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
        UiBreadcrumbsComponent,
        NotificationIconComponent,
        AccordionArrowIconComponent,
        ScrollingModule,
        LetDirective
    ]
})
export class CabinetModule {

}

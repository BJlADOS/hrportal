import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ownDepartmentEmployeeRoutes } from './own-department-employees.routing-module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import {
    CheckStaticIconComponent,
    Cross1IconComponent, Cross2IconComponent, EditWhiteIconComponent,
    FilterIconComponent,
    MagnifierIconComponent, PlusIconComponent,
    UpArrowIconComponent
} from '../../../../../../../assets/img';
import { LetDirective } from '../../../../../../lib/directives/let.directive';
import { EmployeeSearchComponent } from './components/employee-search/employee-search.component';
import { SharedModule } from '../../../../../../lib';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeListLayoutComponent } from './components/employee-list-layout/employee-list-layout.component';
import { EmployeeFiltersComponent } from './components/employee-filters/employee-filters.component';
import {
    ScrollUpButtonComponent
} from '../../../../../../common/scroll-up-button/components/scroll-up-button/scroll-up-button.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeDeclinationPipe } from './pipes/employee-declination.pipe';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';
import { EmployeeListMainLayoutComponent } from './components/employee-list-main-layout/employee-list-main-layout.component';

@NgModule({
    imports: [
        CommonModule,
        ownDepartmentEmployeeRoutes,
        NgxStickySidebarModule,
        UpArrowIconComponent,
        LetDirective,
        Cross1IconComponent,
        MagnifierIconComponent,
        FilterIconComponent,
        SharedModule,
        ReactiveFormsModule,
        NgxStickySidebarModule,
        ScrollUpButtonComponent,
        CheckStaticIconComponent,
        Cross2IconComponent,
        EditWhiteIconComponent,
        PlusIconComponent,
        NgOptimizedImage
    ],
    declarations: [
        EmployeeListComponent,
        EmployeeSearchComponent,
        EmployeeCardComponent,
        EmployeeListLayoutComponent,
        EmployeeFiltersComponent,
        EmployeeDetailComponent,
        EmployeeDeclinationPipe,
        EmployeeLayoutComponent,
        EmployeeListMainLayoutComponent
    ],
    exports: [
        EmployeeListLayoutComponent,
    ]
})
export class OwnDepartmentEmployeesModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ownDepartmentRoutes } from './own-department-employees.routing-module';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { EmployeeCardComponent } from './components/employee-card/employee-card.component';
import {
    Cross1IconComponent,
    FilterIconComponent,
    MagnifierIconComponent,
    UpArrowIconComponent
} from '../../../../../../../assets/img';
import { LetDirective } from '../../../../../../lib/directives/let.directive';
import { EmployeeSearchComponent } from './components/employee-search/employee-search.component';
import { SharedModule } from '../../../../../../lib';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeListLayoutComponent } from './components/employee-list-layout/employee-list-layout.component';
import { EmployeeOrderingComponent } from './components/employee-ordering/employee-ordering.component';
import { EmployeeFiltersComponent } from './components/employee-filters/employee-filters.component';

@NgModule({
    imports: [
        CommonModule,
        ownDepartmentRoutes,
        NgxStickySidebarModule,
        UpArrowIconComponent,
        LetDirective,
        Cross1IconComponent,
        MagnifierIconComponent,
        FilterIconComponent,
        SharedModule,
        ReactiveFormsModule,
        NgxStickySidebarModule,
    ],
    declarations: [
        EmployeeListComponent,
        EmployeeSearchComponent,
        EmployeeCardComponent,
        EmployeeListLayoutComponent,
        EmployeeOrderingComponent,
        EmployeeFiltersComponent
    ]
})
export class OwnDepartmentEmployeesModule {

}

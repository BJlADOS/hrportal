import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration/administration.component';
import { DeletedVacanciesComponent } from './administration/children/deleted-vacancies/deleted-vacancies.component';
import { DeletedResumesComponent } from './administration/children/deleted-resumes/deleted-resumes.component';
import { DeletedUsersComponent } from './administration/children/deleted-users/deleted-users.component';
import { SharedModule } from '../../../../lib';
import { UpArrowIconComponent } from '../../../../../assets/img';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { VacancyModule } from '../vacancy';
import { ResumeModule } from '../resume/resume.module';
import { OwnDepartmentEmployeesModule } from '../own-department/children/employees/own-department-employees.module';
import { SkillAdministrationModule } from './administration/children/skill/skill-administration.module';
import { DeletedUserDetailComponent } from './administration/children/deleted-user-detail/deleted-user-detail.component';

@NgModule({
    declarations: [
        AdministrationComponent,
        DeletedVacanciesComponent,
        DeletedResumesComponent,
        DeletedUsersComponent,
        DeletedUserDetailComponent,
    ],
    imports: [
        CommonModule,
        AdministrationRoutingModule,
        VacancyModule,
        ResumeModule,
        OwnDepartmentEmployeesModule,
        SharedModule,
        UpArrowIconComponent,
        NgxStickySidebarModule.withConfig({
            minWidth: '280px',
        }),
        SkillAdministrationModule
    ]
})
export class AdministrationModule { }

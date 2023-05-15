import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { administrationRouting } from './administration-routing.module';
import { AdministrationComponent } from './administration/administration.component';
import { DeletedVacanciesComponent } from './administration/children/deleted-vacancies/deleted-vacancies.component';
import { DeletedResumesComponent } from './administration/children/deleted-resumes/deleted-resumes.component';
import { DeletedUsersComponent } from './administration/children/deleted-users/deleted-users.component';
import { SharedModule } from '../../../../lib';
import { UpArrowIconComponent } from '../../../../../assets/img';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { VacanciesSearchService } from '../../../../common';

@NgModule({
    declarations: [
        AdministrationComponent,
        DeletedVacanciesComponent,
        DeletedResumesComponent,
        DeletedUsersComponent,
    ],
    providers: [
        VacanciesSearchService,
    ],
    imports: [
        CommonModule,
        administrationRouting,
        SharedModule,
        UpArrowIconComponent,
        NgxStickySidebarModule.withConfig({
            minWidth: '280px',
        }),
    ]
})
export class AdministrationModule { }

import { NgModule } from '@angular/core';
import { ArchivedResumesComponent } from './components/archived-resumes/archived-resumes.component';
import { ArchivedVacanciesComponent } from './components/archived-vacancies/archived-vacancies.component';
import { ArchivedEntitiesRoutingModule } from './archived-entities-routing.module';
import { VacancyModule } from '../../../vacancy';
import { ResumeModule } from '../../../resume/resume.module';
import { SharedModule } from '../../../../../../lib';
import { UpArrowIconComponent } from '../../../../../../../assets/img';
import { ArchivedLayoutComponent } from './components/archived-layout/archived-layout.component';
import {
    SkillAdministrationModule
} from '../../../administration/administration/children/skill/skill-administration.module';

@NgModule({
    declarations: [
        ArchivedResumesComponent,
        ArchivedVacanciesComponent,
        ArchivedLayoutComponent
    ],
    imports: [
        ArchivedEntitiesRoutingModule,
        VacancyModule,
        ResumeModule,
        SharedModule,
        UpArrowIconComponent,
        SkillAdministrationModule,
    ]
})
export class ArchivedEntitiesModule {

}

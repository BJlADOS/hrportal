import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    AccordionComponent,
    ErrorComponent,
    SearchSelectFormComponent, SelectComponent,
    SelectSmallComponent, SelectWithRadioComponent,
    SelectWithRadioMultipleComponent, SelectWithRadioMultipleSearchComponent,
    SelectWithSearchComponent
} from './components';
import {
    AccordionContentDirective,
    AccordionItemDirective,
    ClickOutsideDirective,
    DragAndDropDirective,
    LimitInputDirective
} from './directives';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxMaskModule } from 'ngx-mask';
import { EmploymentPipe, SchedulePipe } from '../utils';
import { ReactiveFormsModule } from '@angular/forms';
import { HoverListenerDirective } from './directives/hover-listener.directive';
import { AccordionArrowIconComponent } from '../../../assets/img/accordion-arrow/accordion-arrow-icon';
import { CheckCircleIconComponent } from '../../../assets/img/check-circle/check-circle-icon';
import { CheckCircleEmptyIconComponent } from '../../../assets/img/check-circle-empty/check-circle-empty-icon';
import { CheckSquareIconComponent } from '../../../assets/img/check-square/check-square-icon';
import { CheckSquareEmptyComponent } from '../../../assets/img/check-square-empty/check-square-empty-icon';
import { MagnifierIconComponent } from '../../../assets/img/magnifier/magnifier-icon';
import { Cross1IconComponent } from '../../../assets/img/cross1/cross1-icon';
import { FilterIconComponent, UpArrowIconComponent } from '../../../assets/img';
import { VacancyFiltersComponent } from './components/vacancy/vacancy-filters/vacancy-filters.component';
import { VacancySearchComponent } from './components/vacancy/vacancy-search/vacancy-search.component';
import { VacancyCardComponent } from './components/vacancy/vacancy-card/vacancy-card.component';
import { VacancyDeclinationPipe } from '../../common/vacancy/pipes/vacancy-declination.pipe';
import { VacancyListComponent } from './components/vacancy/vacancy-list/vacancy-list.component';
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { ResumeListComponent } from './components/resume/resume-list/resume-list.component';
import { ResumeFiltersComponent } from './components/resume/resume-filters/resume-filters.component';
import { ResumeSearchComponent } from './components/resume/resume-search/resume-search.component';
import { ResumeCardComponent } from './components/resume/resume-card/resume-card.component';

const exportingComponents: any[] = [
    SchedulePipe,
    EmploymentPipe,
    ClickOutsideDirective,
    ErrorComponent,
    SelectComponent,
    SelectWithSearchComponent,
    DragAndDropDirective,
    SelectSmallComponent,
    SearchSelectFormComponent,
    SelectWithRadioComponent,
    SelectWithRadioMultipleComponent,
    AccordionComponent,
    AccordionContentDirective,
    AccordionItemDirective,
    SelectWithRadioMultipleSearchComponent,
    LimitInputDirective,
    HoverListenerDirective,
    VacancyFiltersComponent,
    VacancySearchComponent,
    VacancyCardComponent,
    VacancyListComponent,
    ResumeListComponent,
    ResumeFiltersComponent,
    ResumeSearchComponent,
    ResumeCardComponent,
];

@NgModule({
    declarations: [
        ...exportingComponents,
        VacancyDeclinationPipe,
    ],
    exports: exportingComponents,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ScrollingModule,
        NgxMaskModule.forChild(),
        AccordionArrowIconComponent,
        CheckCircleIconComponent,
        CheckCircleEmptyIconComponent,
        CheckSquareIconComponent,
        CheckSquareEmptyComponent,
        MagnifierIconComponent,
        Cross1IconComponent,
        FilterIconComponent,
        NgxStickySidebarModule.withConfig({
            minWidth: '280px',
        }),
        UpArrowIconComponent,
    ]
})
export class SharedModule { }

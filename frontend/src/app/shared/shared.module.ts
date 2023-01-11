import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SchedulePipe } from '../pipes/schedule/schedule.pipe';
import { EmploymentPipe } from '../pipes/employment/employment.pipe';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { ErrorComponent } from './components/error/error.component';
import { CUSTOM_SELECT_VALUE_ACCESSOR, SelectComponent } from './components/select/select.component';
import { SelectWithSearchComponent } from './components/select-with-search/select-with-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragAndDropDirective } from './directives/drag-and-drop/drag-and-drop.directive';
import { CreateResumeComponent } from './components/create-resume/create-resume.component';
import { NgxMaskModule } from 'ngx-mask';
import { CUSTOM_SMALL_SELECT_VALUE_ACCESSOR, SelectSmallComponent } from './components/select-small/select-small.component';
import { SearchSelectFormComponent } from './components/search-select-form/search-select-form.component';
import { SelectWithRadioComponent } from './components/select-with-radio/select-with-radio.component';
import { SelectWithRadioMultipleComponent } from './components/select-with-radio-multiple/select-with-radio-multiple.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { AccordionContentDirective } from './directives/content/accordion-content.directive';
import { AccordionItemDirective } from './directives/item/accordion-item.directive';
import { SelectWithRadioMultipleSearchComponent } from './components/select-with-radio-multiple-search/select-with-radio-multiple-search.component';
import { LimitInputDirective } from './directives/limit-input/limit-input.directive';



@NgModule({
  declarations: [
    HeaderComponent,
    BreadcrumbComponent,
    SchedulePipe,
    EmploymentPipe,
    ClickOutsideDirective,
    ErrorComponent,
    SelectComponent,
    SelectWithSearchComponent,
    DragAndDropDirective,
    CreateResumeComponent,
    SelectSmallComponent,
    SearchSelectFormComponent,
    SelectWithRadioComponent,
    SelectWithRadioMultipleComponent,
    AccordionComponent,
    AccordionContentDirective,
    AccordionItemDirective,
    SelectWithRadioMultipleSearchComponent,
    LimitInputDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgxMaskModule.forChild(),
  ],
  exports: [
    HeaderComponent,
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
  ]
})
export class SharedModule { }

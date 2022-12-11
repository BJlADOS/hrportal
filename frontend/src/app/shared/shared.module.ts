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
  ]
})
export class SharedModule { }

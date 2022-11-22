import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SchedulePipe } from '../pipes/schedule/schedule.pipe';
import { EmploymentPipe } from '../pipes/employment/employment.pipe';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { ErrorComponent } from './components/error/error.component';
import { SelectComponent } from './components/select/select.component';
import { SelectWithSearchComponent } from './components/select-with-search/select-with-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';



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
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ScrollingModule,
  ],
  exports: [
    HeaderComponent,
    SchedulePipe,
    EmploymentPipe,
    ClickOutsideDirective,
    ErrorComponent,
    SelectComponent,
    SelectWithSearchComponent,
  ]
})
export class SharedModule { }

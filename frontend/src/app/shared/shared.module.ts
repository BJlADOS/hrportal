import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SchedulePipe } from '../pipes/schedule/schedule.pipe';
import { EmploymentPipe } from '../pipes/employment/employment.pipe';
import { ClickOutsideDirective } from './directives/click-outside/click-outside.directive';
import { ErrorComponent } from './components/error/error.component';



@NgModule({
  declarations: [
    HeaderComponent,
    BreadcrumbComponent,
    SchedulePipe,
    EmploymentPipe,
    ClickOutsideDirective,
    ErrorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    SchedulePipe,
    EmploymentPipe,
    ClickOutsideDirective,
    ErrorComponent,
  ]
})
export class SharedModule { }

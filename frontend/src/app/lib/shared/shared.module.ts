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
];

@NgModule({
    declarations: [
        ...exportingComponents
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ScrollingModule,
        NgxMaskModule.forChild(),
    ],
    exports: exportingComponents
})
export class SharedModule { }

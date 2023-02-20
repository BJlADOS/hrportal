import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
    SelectWithRadioMultipleComponent
} from './components/select-with-radio-multiple/select-with-radio-multiple.component';
import { AccordionItemDirective } from './directives/accordion-item.directive';
import { LimitInputDirective } from './directives/limit-input.directive';
import { SelectSmallComponent } from './components/select-small/select-small.component';
import { SelectWithSearchComponent } from './components/select-with-search/select-with-search.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxMaskModule } from 'ngx-mask';
import { DragAndDropDirective } from './directives/drag-and-drop.directive';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SearchSelectFormComponent } from './components/search-select-form/search-select-form.component';
import { ErrorComponent } from './components/error/error.component';
import { SelectWithRadioComponent } from './components/select-with-radio/select-with-radio.component';
import { AccordionContentDirective } from './directives/accordion-content.directive';
import { AccordionComponent } from './components/accordion/accordion.component';
import {
    SelectWithRadioMultipleSearchComponent
} from './components/select-with-radio-multiple-search/select-with-radio-multiple-search.component';
import { SelectComponent } from './components/select/select.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmploymentPipe, SchedulePipe } from '../pipes';

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

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
import { NgxStickySidebarModule } from '@smip/ngx-sticky-sidebar';
import { LoaderComponent } from './components/loader/loader.component';
import { GlobalLoaderComponent } from './components/global-loader/global-loader.component';
import { AutoResizeTextareaDirective } from '../../common/cabinet/grade/directives/auto-resize-textarea.directive';
import {AutoResizeInputDirective} from "../../common/cabinet/grade/directives/auto-resize-input.directive";

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
    AutoResizeTextareaDirective,
    AutoResizeInputDirective,
];

@NgModule({
    declarations: [
        ...exportingComponents,
        LoaderComponent,
        GlobalLoaderComponent,
    ],
    exports: [
        exportingComponents,
        LoaderComponent
    ],
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

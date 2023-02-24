import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../lib';
import { CreateResumeComponent } from './components';

const exportingComponents: any[] = [
    CreateResumeComponent
];

@NgModule({
    declarations: exportingComponents,
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule
    ],
    exports: exportingComponents
})
export class ResumeCreateModule {

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateResumeComponent } from './components/create-resume/create-resume.component';
import { SharedModule } from '../../../../lib/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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

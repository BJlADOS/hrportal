import { NgModule } from '@angular/core';
import { SkillBlockComponent } from './components/skill-block/skill-block.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import {
    Cross1IconComponent,
    Cross2IconComponent, MagnifierIconComponent,
    MinusIconComponent,
    PlusIconComponent
} from '../../../../../../../../assets/img';
import { SharedModule } from '../../../../../../../lib';
import { SkillSearchComponent } from './components/skill-search/skill-search.component';
import { SkillAddComponent } from './components/skill-add/skill-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LetDirective } from '../../../../../../../lib/directives/let.directive';
import { SearchLensIconComponent } from '../../../../../../../../assets/img/search-lens/search-lens-icon';

@NgModule({
    exports: [
        SkillBlockComponent
    ],
    imports: [
        NgForOf,
        AsyncPipe,
        NgIf,
        Cross2IconComponent,
        PlusIconComponent,
        MinusIconComponent,
        Cross1IconComponent,
        MagnifierIconComponent,
        SharedModule,
        ReactiveFormsModule,
        LetDirective,
        SearchLensIconComponent
    ],
    declarations: [
        SkillBlockComponent,
        SkillSearchComponent,
        SkillAddComponent
    ]
})
export class SkillAdministrationModule {

}

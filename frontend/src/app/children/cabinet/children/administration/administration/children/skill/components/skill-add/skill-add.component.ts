import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SkillAdministrationService } from '../../services/skill-administration.service';
import { SkillAdditionViewModel } from '../../view-models/skill-addition.view-model';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'skill-add',
    templateUrl: 'skill-add.component.html',
    styleUrls: ['skill-add.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillAddComponent {
    @Input()
    public set viewModel(value: SkillAdditionViewModel) {
        this.viewModel$.next(value);
    }

    protected viewModel$: BehaviorSubject<SkillAdditionViewModel | null> =
        new BehaviorSubject<SkillAdditionViewModel | null>(null);

    constructor(
        private _skillService: SkillAdministrationService,
    ) { }

    public addNewSkill(): void {
        const skillName: string = this.viewModel$.value?.form.controls['skillName'].value;
        if (skillName) {
            this._skillService.addSkill(skillName);
            this.viewModel$.value?.form.controls['skillName'].setValue('');
            this.viewModel$.value?.toggleAdditionMode();
        }
    }
}

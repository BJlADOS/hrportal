import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SkillAdministrationService } from '../../services/skill-administration.service';
import { SkillLazyLoadingService } from '../../services/skill-lazy-loading.service';
import { SkillBlockViewModel } from '../../view-models/skill-block.view-model';
import { SkillManagerService } from '../../services/skill-manager.service';
import { contentExpansion, contentExpansionHorizontal } from '../../../../../../../../../lib';

@Component({
    selector: 'skill-block',
    templateUrl: 'skill-block.component.html',
    styleUrls: ['skill-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        SkillAdministrationService,
        SkillLazyLoadingService,
        SkillManagerService
    ],
    animations: [contentExpansion, contentExpansionHorizontal],
})
export class SkillBlockComponent implements OnInit {
    public viewModel: SkillBlockViewModel;

    constructor(
        public lazyLoadingSkillService: SkillLazyLoadingService,
        protected skillService: SkillAdministrationService,
        private _skillManagerService: SkillManagerService,
    ) {
        this.viewModel = new SkillBlockViewModel();
        this._skillManagerService.initializeViewModel(this.viewModel);
    }

    public ngOnInit(): void {
        this.lazyLoadingSkillService.addPage();
    }

    public removeSkill(id: number): void {
        this.skillService.removeSkill(id);
    }
}

import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { SkillSearchViewModel } from '../../view-models/skill-search-view.model';
import { BehaviorSubject } from 'rxjs';
import { SkillAdministrationService } from '../../services/skill-administration.service';
import { SkillLazyLoadingService } from '../../services/skill-lazy-loading.service';

@Component({
    selector: 'skill-search',
    templateUrl: 'skill-search.component.html',
    styleUrls: ['skill-search.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillSearchComponent implements OnDestroy {
    @Input()
    public set viewModel(value: SkillSearchViewModel) {
        this.viewModel$.next(value);
    }

    protected viewModel$: BehaviorSubject<SkillSearchViewModel | null> =
        new BehaviorSubject<SkillSearchViewModel | null>(null);

    constructor(
        private _skillAdministration: SkillAdministrationService,
        private _skillLazyLoadingService: SkillLazyLoadingService) {
    }

    public ngOnDestroy(): void {
        this.reset();
    }

    public search(): void {
        const searchString: string = this.viewModel$.value?.form.controls['searchString'].value;

        if (searchString) {
            this._skillAdministration.searchSkill(searchString);
        }
    }

    public reset(): void {
        const viewModel: SkillSearchViewModel | null = this.viewModel$.value;
        if (viewModel?.form.controls['searchString'].value) {
            viewModel?.form.controls['searchString'].setValue('');
            this.viewModel$.next(viewModel);
            this._skillAdministration.searchSkill();
        }
    }
}

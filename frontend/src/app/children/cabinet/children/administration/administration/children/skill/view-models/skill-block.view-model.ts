import { SkillSearchViewModel } from './skill-search-view.model';
import { SkillAdditionViewModel } from './skill-addition.view-model';

export class SkillBlockViewModel {
    public searchViewModel!: SkillSearchViewModel;
    public additionViewModel!: SkillAdditionViewModel;

    public toggleShowMore(): void {
        this.searchViewModel.showMoreMode$.next(!this.searchViewModel.showMoreMode$.value);
        this.disableAdditionMode();
    }

    public enableAdditionMode(): void {
        this.additionViewModel.isAdditionMode$.next(true);
    }

    public disableAdditionMode(): void {
        this.additionViewModel.isAdditionMode$.next(false);
    }
}

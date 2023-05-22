import { Injectable } from '@angular/core';
import { SkillsService } from '../../../../../../../../common';
import { SkillLazyLoadingService } from './skill-lazy-loading.service';
import { SkillBlockViewModel } from '../view-models/skill-block.view-model';
import { SkillSearchViewModel } from '../view-models/skill-search-view.model';
import { SkillAdditionViewModel } from '../view-models/skill-addition.view-model';
import { FormBuilder } from '@angular/forms';

@Injectable()
export class SkillManagerService {
    constructor(
        private _skillRequestService: SkillsService,
        private _skillLazyLoadingService: SkillLazyLoadingService,
        private _formBuilder: FormBuilder,
    ) { }

    public initializeViewModel(viewModel: SkillBlockViewModel): void {
        viewModel.searchViewModel = new SkillSearchViewModel();
        viewModel.additionViewModel = new SkillAdditionViewModel();

        viewModel.searchViewModel.form =
            this._formBuilder.group({
                searchString: ''
            });

        viewModel.additionViewModel.form =
            this._formBuilder.group({
                skillName: ''
            });
    }

}

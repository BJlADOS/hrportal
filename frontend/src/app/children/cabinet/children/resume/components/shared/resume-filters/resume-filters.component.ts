import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import {
    FormGenerator,
    getEmploymentRussianAsArray,
    getScheduleRussianAsArray,
    ISelectOption
} from '../../../../../../../lib';
import { ISkill, SkillsService } from '../../../../../../../common';
import { ResumeSearchService } from '../../../../../../../common/resume/services/resume-search.service';

@Component({
    selector: 'app-resume-filters',
    templateUrl: './resume-filters.component.html',
    styleUrls: ['./resume-filters.component.scss']
})
export class ResumeFiltersComponent {

    public filterForm: FormGroup = this._form.getResumesFiltersForm();
    @Output() public madeSearch: EventEmitter<null> = new EventEmitter<null>();

    public schedule: ISelectOption[] = getScheduleRussianAsArray();
    public employment: ISelectOption[] = getEmploymentRussianAsArray();
    public skills$: Observable<ISkill[]> = this._skills.skills$;

    constructor(
        private _form: FormGenerator,
        private _skills: SkillsService,
        private _resumeSearch: ResumeSearchService,
    ) { }

    public applyFilters(): void {
        this.madeSearch.emit();
        this._resumeSearch.setFilters(this.filterForm.value);
    }

    public resetFilters(): void {
        this.filterForm = this._form.getFilterForm();
        this.madeSearch.emit();
        this._resumeSearch.setFilters(this.filterForm.value);
    }
}

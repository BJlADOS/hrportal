import { Component, EventEmitter, Output } from '@angular/core';
import { DepartmentService, SkillsService, VacanciesSearchService } from '../../../../../../common';
import {
    FormGenerator,
    getEmploymentRussianAsArray,
    getScheduleRussianAsArray,
    ISelectOption
} from '../../../../../../lib';


@Component({
    selector: 'app-filters',
    templateUrl: './filters.component.html',
    styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {
    public filterForm = this._form.getFilterForm();
    @Output() madeSearch = new EventEmitter<null>();

    public schedule: ISelectOption[] = getScheduleRussianAsArray();
    public employment: ISelectOption[] = getEmploymentRussianAsArray();
    public departments$ = this._department.departments$;
    public skills$ = this._skills.skills$;

    constructor(
        private _form: FormGenerator,
        private _department: DepartmentService,
        private _skills: SkillsService,
        private _vacancySearch: VacanciesSearchService,
    ) { }

    public applyFilters(): void {
        this.madeSearch.emit();
        this._vacancySearch.setFilters(this.filterForm.value);
    }

    public resetFilters(): void {
        this.filterForm = this._form.getFilterForm();
        this.madeSearch.emit();
        this._vacancySearch.setFilters(this.filterForm.value);
    }
}

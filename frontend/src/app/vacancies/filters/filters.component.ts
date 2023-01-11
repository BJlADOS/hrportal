import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { IFilter } from 'src/app/interfaces/search';
import { ISelectOption } from 'src/app/interfaces/select';
import { getEmploymentRussianAsArray, getScheduleRussianAsArray } from 'src/app/interfaces/vacancy';
import { DepartmentService } from 'src/app/services/department/department.service';
import { VacanciesSearchService } from 'src/app/services/search/vacancies-search.service';
import { SkillsService } from 'src/app/services/skills/skills.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {

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

  public ngOnInit(): void {
  }

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

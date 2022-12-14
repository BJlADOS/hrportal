import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { IVacancyPage } from 'src/app/interfaces/pagination';
import { getOrderingRussianAsArray, Ordering } from 'src/app/interfaces/search';
import { ISelectOption } from 'src/app/interfaces/select';
import { VacanciesSearchService } from 'src/app/services/search/vacancies-search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public vacancies$: Observable<IVacancyPage> = this._vacancySearch.vacancies$;

  public searchForm: FormGroup = this._form.getSeachForm();
  public orderingForm: FormGroup = this._form.getOrderingForm();
  public ordering: ISelectOption[] = getOrderingRussianAsArray();

  @Output() madeSearch = new EventEmitter<null>();
  @Output() filterToggle = new EventEmitter<null>();

  constructor(
    private _form: FormGenerator,
    private _vacancySearch: VacanciesSearchService,
  ) { }

  public ngOnInit(): void {
    this.orderingForm.controls['ordering'].valueChanges.subscribe((value: ISelectOption) => {
      console.log('ordering');
      this.madeSearch.emit();
      this._vacancySearch.sort(value.id as Ordering);
    });
  }

  public search(): void {
    this.madeSearch.emit();
    this._vacancySearch.search(this.searchForm.value.search);
  }

  public reset(): void {
    this.searchForm = this._form.getSeachForm();
  }

  public toggleFilters(): void {
    this.filterToggle.emit();
  }

  // public sort(): void {
  //   this._vacancySearch.sort(this.orderingForm.value.ordering);
  // }

}

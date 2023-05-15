import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IVacancyPage, VacanciesSearchService } from '../../../../../common';
import { FormGenerator, ISelectOption } from '../../../../forms';
import { getOrderingRussianAsArray } from '../../../../utils/enum-mappers/ordering-russian-array-mapper';
import { Ordering } from '../../../../utils';



@Component({
    selector: 'app-vacancy-search',
    templateUrl: './vacancy-search.component.html',
    styleUrls: ['./vacancy-search.component.scss']
})
export class VacancySearchComponent implements OnInit {

    public vacancies$: Observable<IVacancyPage> = this._vacancySearch.vacancies$;

    public searchForm: FormGroup = this._form.getSearchForm();
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
            this.madeSearch.emit();
            this._vacancySearch.sort(value.id as Ordering);
        });
    }

    public search(): void {
        this.madeSearch.emit();
        this._vacancySearch.search(this.searchForm.value.search);
    }

    public reset(): void {
        this.searchForm = this._form.getSearchForm();
    }

    public toggleFilters(): void {
        this.filterToggle.emit();
    }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IVacancyPage, VacanciesSearchService } from '../../../../../../common';
import { FormGenerator, ISelectOption, Ordering } from '../../../../../../lib';
import { getOrderingRussianAsArray } from '../../../../../../lib/utils/enum-mappers/ordering-russian-array-mapper';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

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
        this.searchForm = this._form.getSearchForm();
    }

    public toggleFilters(): void {
        this.filterToggle.emit();
    }
}

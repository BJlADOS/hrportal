import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IVacancyPage } from '../../../../../../interfaces/pagination';
import { ISelectOption } from '../../../../../../interfaces/select';
import { getOrderingRussianAsArray, Ordering } from '../../../../../../interfaces/search';
import { FormGenerator } from '../../../../../../classes/form-generator';
import { VacanciesSearchService } from '../../services';
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
}

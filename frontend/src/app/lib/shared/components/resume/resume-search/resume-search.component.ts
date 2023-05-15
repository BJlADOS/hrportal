import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IResumePage } from '../../../../../common/resume/interfaces/resume-page.interface';
import { Observable } from 'rxjs';
import { FormGenerator, ISelectOption } from '../../../../forms';
import { getOrderingRussianAsArray } from '../../../../utils/enum-mappers/ordering-russian-array-mapper';
import { ResumeSearchService } from '../../../../../common/resume/services/resume-search.service';
import { Ordering } from '../../../../utils';


@Component({
    selector: 'app-resume-search',
    templateUrl: './resume-search.component.html',
    styleUrls: ['./resume-search.component.scss']
})
export class ResumeSearchComponent implements OnInit {

    public resumes$: Observable<IResumePage> = this._resumeSearch.resumes$;

    public searchForm: FormGroup = this._form.getSearchForm();
    public orderingForm: FormGroup = this._form.getOrderingForm();
    public ordering: ISelectOption[] = getOrderingRussianAsArray();

    @Output() public madeSearch: EventEmitter<null> = new EventEmitter<null>();
    @Output() public filterToggle: EventEmitter<null> = new EventEmitter<null>();

    constructor(
        private _form: FormGenerator,
        private _resumeSearch: ResumeSearchService,
    ) { }

    public ngOnInit(): void {
        this.orderingForm.controls['ordering'].valueChanges.subscribe((value: ISelectOption) => {
            console.log('ordering');
            this.madeSearch.emit();
            this._resumeSearch.sort(value.id as Ordering);
        });
    }

    public search(): void {
        this.madeSearch.emit();
        this._resumeSearch.search(this.searchForm.value.search);
    }

    public reset(): void {
        this.searchForm = this._form.getSearchForm();
    }

    public toggleFilters(): void {
        this.filterToggle.emit();
    }

}

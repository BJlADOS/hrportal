import { Component } from '@angular/core';
import { Observable, take } from 'rxjs';

import { ISkill, SkillsService } from '../../../../../../../../common';
import { EmployeeSearchService } from '../../services/employee-search.service';
import { EmployeeFilterManagerService } from '../../services/employee-filter-manager.service';
import { EmployeeFilterViewModel } from '../../view-models/employee-filter.view-model';

@Component({
    selector: 'employee-filters',
    templateUrl: './employee-filters.component.html',
    styleUrls: ['./employee-filters.component.scss'],
    providers: [
        EmployeeFilterManagerService
    ]
})
export class EmployeeFiltersComponent {
    public skills$: Observable<ISkill[]> = this._skills.skills$;
    protected viewModel?: EmployeeFilterViewModel;

    constructor(
        private _skills: SkillsService,
        private _employeeSearchService: EmployeeSearchService,
        private _employeeFilterService: EmployeeFilterManagerService,
    ) {
        this._employeeFilterService.fillViewModel(new EmployeeFilterViewModel())
            .pipe(
                take(1)
            )
            .subscribe((viewModel: EmployeeFilterViewModel) => {
                this.viewModel = viewModel;
            });
    }

    public applyFilters(): void {
        this._employeeSearchService.setFilters(this.viewModel?.form?.value);
    }

    public resetFilters(): void {
        this._employeeSearchService.setFilters(this.viewModel?.form?.value);
    }
}

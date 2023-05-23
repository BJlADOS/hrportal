import { Component } from '@angular/core';
import { map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { EmployeeDetailViewModel } from '../../view-models/employee-detail.view-model';
import { ActivatedRoute } from '@angular/router';
import { IUser } from '../../../../../../../../common';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
    selector: 'app-profile',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent {
    public viewModel$!: Observable<EmployeeDetailViewModel | null>;
    public iconUrl$: Subject<string> = new Subject<string>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _lazyLoadingService: EmployeePageLazyLoadingService,
        private _employeeService: EmployeeService
    ) {
        this.viewModel$ = this.getViewModelDataStream();
    }

    public setDefaultIcon(): void {
        this.iconUrl$.next('assets/img/profile-placeholder.png');
    }

    private getViewModelDataStream(): Observable<EmployeeDetailViewModel | null> {
        const employeeId: number = parseInt(this._activatedRoute.snapshot.params['id'] ?? 'null');

        return this._lazyLoadingService.list$
            .pipe(
                switchMap((employeeData: IUser[] | null) => {
                    if (isNaN(employeeId) || !employeeData || !employeeData.length) {
                        return of([]);
                    }

                    return of(employeeData);
                }),
                map((employeesData: IUser[]) => {
                    return employeesData?.find((data: IUser) => data.id === employeeId);
                }),
                switchMap((employeeData?: IUser) => {
                    return employeeData
                        ? of(employeeData)
                        : this._employeeService.getEmployeeById(employeeId);
                }),
                map((employeeData: IUser) => {
                    return employeeData
                        ? new EmployeeDetailViewModel(employeeData)
                        : null;
                }),
                tap((viewModel: EmployeeDetailViewModel | null) => {
                    if (viewModel) {
                        this.iconUrl$.next(viewModel.avatarUrl);
                    }
                })
            );
    }
}

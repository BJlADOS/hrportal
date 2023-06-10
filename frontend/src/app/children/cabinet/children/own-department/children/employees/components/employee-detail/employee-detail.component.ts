import { ChangeDetectorRef, Component } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { EmployeeDetailViewModel } from '../../view-models/employee-detail.view-model';
import { ActivatedRoute } from '@angular/router';
import { IUser, UserService } from '../../../../../../../../common';
import { EmployeePageLazyLoadingService } from '../../services/employee-page-lazy-loading.service';
import { EmployeeService } from '../../services/employee.service';
import { Status } from '../../../../../../../../lib/utils/enums/status.enum';
import { DestroyService, ModalService } from '../../../../../../../../lib';
import { DeleteEmployeeComponent } from '../modals/delete-employee/delete-employee.component';
import { ActivityService } from '../../../../../../../../common/cabinet/grade/services/activity.service';
import { GradeModel } from '../../../../../../../../common/cabinet/grade/models/grade.model';
import { ActivityState } from '../../../../../../../../common/cabinet/grade/enums/activity-state.enum';
import { GradeService } from '../../../../../../../../common/cabinet/grade/services/grade-service';
import { GradeRequestService } from '../../../../../../../../common/cabinet/grade/services/grade-request.service';

@Component({
    selector: 'app-profile',
    templateUrl: './employee-detail.component.html',
    styleUrls: ['./employee-detail.component.scss'],
    providers: [
        DestroyService,
        GradeService,
        GradeRequestService,
    ]
})
export class EmployeeDetailComponent {
    public viewModel$!: Observable<EmployeeDetailViewModel | null>;
    public iconUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('assets/img/profile-placeholder.png');
    public user$: Observable<IUser | null> = this._userService.currentUser$;
    public inactiveGrades: GradeModel[] = [];
    public activeGrade?: GradeModel;
    public grades?: GradeModel[];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _lazyLoadingService: EmployeePageLazyLoadingService,
        private _employeeService: EmployeeService,
        private _userService: UserService,
        private _modalService: ModalService,
        private _grade: GradeService,
        private _destroy$: DestroyService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.viewModel$ = this.getViewModelDataStream();
        this.getGrades();
    }

    public setDefaultIcon(): void {
        this.iconUrl$.next('assets/img/profile-placeholder.png');
    }

    public deleteEmployee(employee: EmployeeDetailViewModel): void {
        this._modalService.open(DeleteEmployeeComponent, { employee });
    }

    public getGrades(): void {
        const employeeId: number = parseInt(this._activatedRoute.snapshot.params['id'] ?? 'null');

        this._grade.getUserGrades(employeeId)
            .subscribe({
                next: (grades: GradeModel[]) => {
                    this.inactiveGrades = grades.filter(g => !g.inWork).reverse();
                    this.activeGrade = grades.find(g => g.inWork);
                    this.grades = grades;
                }
            });
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

    protected readonly Status = Status;
    protected readonly ActivityState = ActivityState;
}

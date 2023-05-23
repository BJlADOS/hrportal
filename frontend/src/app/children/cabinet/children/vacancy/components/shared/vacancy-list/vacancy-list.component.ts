import { Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import {
    IDepartment,
    IUser,
    IVacancy,
    IVacancyPage,
    UserService,
    VacanciesSearchService,
    VacancyService
} from '../../../../../../../common';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../../lib';
import { USER_DEPARTMENT_TOKEN } from '../../../../own-department/tokens/user-department.token';


@Component({
    selector: 'app-vacancy-list',
    templateUrl: './vacancy-list.component.html',
    styleUrls: ['./vacancy-list.component.scss'],
    animations: [contentExpansionHorizontal],
    providers: [DestroyService],
})
export class VacancyListComponent implements OnInit, OnDestroy {

    @Input() public defaultStatus: Status = Status.public;

    public vacancies$: Observable<IVacancyPage> = this._vacancySearch.vacancies$;
    public vacancies: IVacancy[] = [];
    public loadingError: string | undefined;
    public user: Observable<IUser | null> = this._user.currentUser$;

    public canScrollBack: boolean = false;
    public filtersExpanded: boolean = false;
    public update$: Subject<boolean> = new Subject<boolean>();

    public readonly Status = Status;

    private vacanciesAmount: number = 0;
    private callback = this.throttle(this.checkPosition.bind(this), 250);

    constructor(
        private _vacancy: VacancyService,
        private _vacancySearch: VacanciesSearchService,
        private _user: UserService,
        private _router: Router,
        private _destroy$: DestroyService,
        @Optional() @Inject(USER_DEPARTMENT_TOKEN) protected department$: Subject<IDepartment>
    ) { }

    public ngOnInit(): void {
        this.vacancies$
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (page: IVacancyPage) => {
                    this.vacancies.push(...page.results);
                    this.vacanciesAmount = page.count;
                    this.update$.next(true);
                },
                error: (error: string) => {
                    this.loadingError = error;
                }
            });

        if (this.department$) {
            this.department$
                .pipe(
                    take(1)
                )
                .subscribe((department: IDepartment) => {
                    this._vacancySearch.setDepartment(department);
                    this._vacancySearch.changeStatus(this.defaultStatus);
                    this._vacancySearch.search();
                });
        } else {
            this._vacancySearch.changeStatus(this.defaultStatus);
            this._vacancySearch.search();
        }

        window.addEventListener('scroll', this.callback);
        window.addEventListener('resize', this.callback);
    }

    public ngOnDestroy(): void {
        this.update$.complete();
        window.removeEventListener('scroll', this.callback);
        window.removeEventListener('resize', this.callback);
        this.resetSearch();
        this._vacancySearch.resetAll();
    }

    public createVacancy(): void {
        this._router.navigate(['cabinet/vacancy/create']);
    }

    public resetSearch(): void {
        this.vacancies = [];
        this.vacanciesAmount = 0;
    }

    public scrollBack(): void {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    public toggleFilters(): void {
        this.filtersExpanded = !this.filtersExpanded;
        setTimeout(() => {
            this.update$.next(true);
        }, 700);
    }

    private async checkPosition(): Promise<void> {
        const height: number = document.body.offsetHeight;
        const screenHeight: number = window.innerHeight;

        const scrolled: number = window.scrollY;

        const threshold: number = height - screenHeight / 4;

        const position: number = scrolled + screenHeight;

        this.canScrollBack = scrolled > 0;

        if (position >= threshold && this.vacancies.length !== this.vacanciesAmount) {
            this._vacancySearch.loadMore();
        }
    }

    private throttle(callee: Function, timeout: number): EventListener {
        let timer: NodeJS.Timeout | null = null;

        return function perform() {
            if (timer) { return; }

            timer = setTimeout(() => {
                callee();

                clearTimeout(timer!);
                timer = null;
            }, timeout);
        };
    }
}

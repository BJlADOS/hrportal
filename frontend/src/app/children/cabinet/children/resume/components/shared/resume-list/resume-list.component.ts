
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { Component, Inject, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../../lib';
import { IResumePage } from '../../../../../../../common/resume/interfaces/resume-page.interface';
import { IDepartment, IResume, ResumeService } from '../../../../../../../common';
import { ResumeSearchService } from '../../../../../../../common/resume/services/resume-search.service';
import { USER_DEPARTMENT_TOKEN } from '../../../../own-department/tokens/user-department.token';


@Component({
    selector: 'app-resume-list',
    templateUrl: './resume-list.component.html',
    styleUrls: ['./resume-list.component.scss'],
    animations: [contentExpansionHorizontal],
    providers: [DestroyService],
})
export class ResumeListComponent implements OnInit, OnDestroy {

    @Input() public defaultStatus: Status = Status.public;

    public resumes$: Observable<IResumePage> = this._resumeSearch.resumes$;
    public resumes: IResume[] = [];
    public loadingError: string | undefined;

    public canScrollBack: boolean = false;
    public filtersExpanded: boolean = false;
    public update$: Subject<boolean> = new Subject<boolean>();

    private _resumesAmount: number = 0;
    private _callback : EventListener = this.throttle(this.checkPosition.bind(this), 250);

    constructor(
        private _resume: ResumeService,
        private _resumeSearch: ResumeSearchService,
        private _destroy$: DestroyService,
        @Optional() @Inject(USER_DEPARTMENT_TOKEN) protected department$: Subject<IDepartment>
    ) { }

    public ngOnInit(): void {
        this.resumes$
            .pipe(takeUntil(this._destroy$))
            .subscribe({
                next: (page: IResumePage) => {
                    this.resumes.push(...page.results);
                    this._resumesAmount = page.count;
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
                    this._resumeSearch.setDepartment(department);
                    this._resumeSearch.changeStatus(this.defaultStatus);
                    this._resumeSearch.search();
                });
        } else {
            this._resumeSearch.changeStatus(this.defaultStatus);
            this._resumeSearch.search();
        }

        window.addEventListener('scroll', this._callback);
        window.addEventListener('resize', this._callback);
    }

    public ngOnDestroy(): void {
        this.update$.complete();
        window.removeEventListener('scroll', this._callback);
        window.removeEventListener('resize', this._callback);
        this.resetSearch();
        this._resumeSearch.resetAll();
    }

    public toggleFilters(): void {
        this.filtersExpanded = !this.filtersExpanded;
        setTimeout(() => {
            this.update$.next(true);
        }, 700);
    }

    public resetSearch(): void {
        this.resumes = [];
        this._resumesAmount = 0;
    }

    public scrollBack(): void {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    private async checkPosition(): Promise<void> {
        const height: number = document.body.offsetHeight;
        const screenHeight: number = window.innerHeight;

        const scrolled: number = window.scrollY;

        const threshold: number = height - screenHeight / 4;

        const position: number = scrolled + screenHeight;

        this.canScrollBack = scrolled > 0;

        if (position >= threshold && this.resumes.length !== this._resumesAmount) {
            this._resumeSearch.loadMore();
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

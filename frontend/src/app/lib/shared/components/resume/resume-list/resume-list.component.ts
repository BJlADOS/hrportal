import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { contentExpansionHorizontal, DestroyService } from '../../../../utils';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IResumePage } from '../../../../../common/resume/interfaces/resume-page.interface';
import { IResume, ResumeService } from '../../../../../common';
import { ResumeSearchService } from '../../../../../common/resume/services/resume-search.service';
import { Status } from '../../../../utils/enums/status.enum';


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
        this._resumeSearch.changeStatus(this.defaultStatus);
        this._resumeSearch.search();

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

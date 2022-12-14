import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { contentExpansionHorizontal } from 'src/app/animations/content-expansion/content-expansion-horizontal';
import { IVacancyPage } from 'src/app/interfaces/pagination';
import { IUser } from 'src/app/interfaces/User';
import { Employment, Experience, IVacancy, Schedule } from 'src/app/interfaces/vacancy';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { VacanciesSearchService } from 'src/app/services/search/vacancies-search.service';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
  animations: [contentExpansionHorizontal],
})
export class VacanciesComponent implements OnInit, OnDestroy {

  public vacancies$: Observable<IVacancyPage> = this._vacancySearch.vacancies$;
  public vacancies: IVacancy[] = [];
  public loadingError: string | undefined;
  public user: Observable<IUser | null> = this._user.currentUser$;

  public canScrollBack: boolean = false;
  public filtersExpanded: boolean = false;
  public update$ = new Subject<boolean>();

  private vacanciesAmount: number = 0;
  private _destroy$ = new Subject<boolean>();
  private callback = this.throttle(this.checkPosition.bind(this), 250);

  constructor(
    private _vacancy: VacancyService,
    private _vacancySearch: VacanciesSearchService,
    private _user: UserService,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this.vacancies$.pipe(takeUntil(this._destroy$)).subscribe({
      next: (page: IVacancyPage) => {
        this.vacancies.push(...page.results);
        this.vacanciesAmount = page.count;
        this.update$.next(true);
      }, error: (error: string) => {
        this.loadingError = error;
      }
    });
    this._vacancySearch.search();

    window.addEventListener('scroll', this.callback);
    window.addEventListener('resize', this.callback);
  }

  public ngOnDestroy(): void {
    this.update$.complete();
    this._destroy$.next(true);
    this._destroy$.complete();
    window.removeEventListener('scroll', this.callback);
    window.removeEventListener('resize', this.callback);
    this.resetSearch();
    this._vacancySearch.resetAll();
  }

  public createVacancy(): void {
    this._router.navigate(['vacancies/create']);
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
      if (timer) { return; };

      timer = setTimeout(() => {
        callee();

        clearTimeout(timer!);
        timer = null;
      }, timeout);
    };
  }
}

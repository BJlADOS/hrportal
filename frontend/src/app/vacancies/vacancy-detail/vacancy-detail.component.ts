import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { takeUntil } from 'rxjs';
import { IVacancy } from 'src/app/interfaces/vacancy';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-vacancy-detail',
  templateUrl: './vacancy-detail.component.html',
  styleUrls: ['./vacancy-detail.component.scss']
})
export class VacancyDetailComponent implements OnInit {

  public vacancy: IVacancy | null = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _destroy$: DestroyService,
    private _vacancy: VacancyService,
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
      const vacancyIdFromRoute: string = paramMap.get('id') as string;
      this._vacancy.getVacancyById(vacancyIdFromRoute).pipe(takeUntil(this._destroy$)).subscribe((vacancy: IVacancy) => {
        this.vacancy = vacancy;
      }
      );
  });
  }

}

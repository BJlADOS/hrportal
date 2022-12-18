import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { Employment, Experience, IVacancy, Schedule } from 'src/app/interfaces/vacancy';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {

  public vacancies: IVacancy[] = [];
  public loadingError: string | undefined;
  public user: Observable<IUser | null> = this._user.currentUser$;

  constructor(
    private _vacancy: VacancyService,
    private _user: UserService,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._vacancy.getVacancies().subscribe({ next: (data) => {
      this.vacancies = data;
    }, error: (err) => {
      this.loadingError = err;
    }});
  }

  public createVacancy(): void {
    this._router.navigate(['vacancies/create']);
  }

}

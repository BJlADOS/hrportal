import { Component, OnInit } from '@angular/core';
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
  ) { }

  public ngOnInit(): void {
    this._vacancy.getVacancies().subscribe({ next: (data) => {
      this.vacancies = data;
      for (let i = 0; i < 4; i++) {
        this.vacancies.push({
          id: 1,
          department: {
            id: 1,
            name: 'IT',
            managerId: 1,
          },
          position: 'Frontend Developer',
          salary: 1000,
          employment: Employment['FULL'],
          schedule: Schedule['FULL'],
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eget aliquam tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc. Donec auctor, nisl eget aliquam tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.',
          requiredSkills: [
            {
              id: 1,
              name: 'HTML',
            },
            {
              id: 2,
              name: 'CSS',
            },
            {
              id: 3,
              name: 'JavaScript',
            },
          ],
          isActive: true,
          modifiedAt: 1610000000000,
          createdAt: 1610000000000,
        })
      }
      console.log(data);
    }, error: (err) => {
      this.loadingError = err;
    }});
  }

}

import { Component, OnInit } from '@angular/core';
import { Expirience } from 'src/app/interfaces/resume';
import { IVacancy } from 'src/app/interfaces/vacancy';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss']
})
export class VacanciesComponent implements OnInit {

  public vacancies: IVacancy[] = [];
  public loadingError: string | undefined;

  constructor(
    private vacancyService: VacancyService,
  ) { }

  public ngOnInit(): void {
    this.vacancyService.getVacancies().subscribe({ next: (data) => {
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
          expirience: Expirience['1-3'],
          employment: 'Full-time',
          schedule: 'Full-time',
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

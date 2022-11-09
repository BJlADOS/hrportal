import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IVacancy } from 'src/app/interfaces/vacancy';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.scss']
})
export class VacancyComponent implements OnInit {

  @Input() public vacancy!: IVacancy;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  public skillsToString(skills: IVacancy['requiredSkills']): string {
    return skills.map((skill) => skill.name).join(', ');
  }

  public openVacancy(): void {
    this.router.navigate([`vacancies/${this.vacancy.id}`]);
  }

  public responseVacancy(): void {
    console.log('Response vacancy');
  }

}

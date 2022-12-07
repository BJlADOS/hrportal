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

  public description: string = '';

  constructor(
    public router: Router,
  ) { }

  public ngOnInit(): void {
    const maxDescriptionLength: number = 400;
    const stringWithoutTags = this.vacancy.description.replace( /(<([^>]+)>)/ig, '')
    if (stringWithoutTags.length < maxDescriptionLength) {
      this.description = stringWithoutTags;
    } else {
      this.description = `${stringWithoutTags.slice(0, maxDescriptionLength)}...`;
    }
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

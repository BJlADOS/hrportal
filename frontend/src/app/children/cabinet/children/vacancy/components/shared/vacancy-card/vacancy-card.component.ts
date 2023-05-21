import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IVacancy } from '../../../../../../../common';
import { ModalService } from '../../../../../../../lib';
import { UploadModalComponent } from '../../upload-modal/upload-modal.component';




@Component({
    selector: 'app-vacancy-card',
    templateUrl: './vacancy-card.component.html',
    styleUrls: ['./vacancy-card.component.scss']
})
export class VacancyCardComponent implements OnInit {

    @Input() public vacancy!: IVacancy;
    @Input() public hideButtons: boolean = false;

    public description: string = '';

    constructor(
        public router: Router,
        private _modal: ModalService,
    ) { }

    public ngOnInit(): void {
        const maxDescriptionLength: number = 400;
        const stringWithoutTags: string = this.vacancy.description.replace( /(<([^>]+)>)/ig, '');
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
        this.router.navigate([`cabinet/vacancies/${this.vacancy.id}`]);
    }

    public responseVacancy(): void {
        this._modal.open(UploadModalComponent, { vacancyId: this.vacancy.id, vacancyName: this.vacancy.position });
    }
}

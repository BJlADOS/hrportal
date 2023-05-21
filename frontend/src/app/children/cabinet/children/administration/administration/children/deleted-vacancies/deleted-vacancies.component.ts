/* eslint-disable @typescript-eslint/typedef */
import { Component } from '@angular/core';


import { contentExpansionHorizontal, DestroyService } from '../../../../../../../lib';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';

@Component({
    selector: 'app-deleted-vacancies',
    templateUrl: './deleted-vacancies.component.html',
    styleUrls: ['./deleted-vacancies.component.scss'],
    providers: [DestroyService],
    animations: [contentExpansionHorizontal],
})
export class DeletedVacanciesComponent {

    public readonly status = Status;
}

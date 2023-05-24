import { Component } from '@angular/core';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../../../lib';
import { Status } from '../../../../../../../../lib/utils/enums/status.enum';

@Component({
    selector: 'app-archived-vacancies',
    templateUrl: './archived-vacancies.component.html',
    styleUrls: ['./archived-vacancies.component.scss'],
    providers: [DestroyService],
    animations: [contentExpansionHorizontal],
})
export class ArchivedVacanciesComponent {

    public readonly status: Status = Status.archived;
}

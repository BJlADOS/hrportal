import { Component } from '@angular/core';
import { Modal } from '../../../../../../../lib';
import {IInputError, IVacancy, VacancyService} from '../../../../../../../common';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-archive-vacancy',
    templateUrl: './archive-vacancy.component.html',
    styleUrls: ['./archive-vacancy.component.scss']
})
export class ArchiveVacancyComponent extends Modal {

    public vacancy!: IVacancy;
    public isLoading: boolean = false;
    public error: IInputError = { message: '' };
    public submitted: boolean = false;

    constructor(
        private _vacancy: VacancyService,
    ) {
        super();
    }

    public onInjectInputs(inputs: any): void {
        this.vacancy = inputs.vacancy;
    }


    public archiveVacancy(): void {
        this.isLoading = true;
        this._vacancy.editVacancy(this.vacancy.id.toString(), { status: Status.archived })
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.submitted = true;
                },
                error: () => {
                    this.error.message = 'Ошибка архивирования вакансии';
                }
            });
    }

    public cancelArchive(): void {
        this.close(this.submitted);
    }
}

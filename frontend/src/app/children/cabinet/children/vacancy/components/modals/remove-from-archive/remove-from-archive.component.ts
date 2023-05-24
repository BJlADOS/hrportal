import { Component } from '@angular/core';
import { IInputError, IVacancy, VacancyService } from '../../../../../../../common';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { finalize } from 'rxjs';
import { Modal } from '../../../../../../../lib';

@Component({
    selector: 'app-remove-from-archive',
    templateUrl: './remove-from-archive.component.html',
    styleUrls: ['./remove-from-archive.component.scss']
})
export class RemoveFromArchiveComponent extends Modal{
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


    public removeFromArchiveVacancy(): void {
        this.isLoading = true;
        this._vacancy.editVacancy(this.vacancy.id.toString(), { status: Status.public })
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.submitted = true;
                },
                error: () => {
                    this.error.message = 'Ошибка разархивирования вакансии';
                }
            });
    }

    public cancelRemoving(): void {
        this.close(this.submitted);
    }

}

import { Component } from '@angular/core';
import { IInputError, IVacancy, VacancyService } from '../../../../../../../common';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { finalize } from 'rxjs';
import { Modal } from '../../../../../../../lib';

@Component({
    selector: 'app-delete-vacancy',
    templateUrl: './delete-vacancy.component.html',
    styleUrls: ['./delete-vacancy.component.scss']
})
export class DeleteVacancyComponent extends Modal{
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


    public deleteVacancy(): void {
        this.isLoading = true;
        this._vacancy.deleteVacancy(this.vacancy.id.toString())
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: () => {
                    this.submitted = true;
                },
                error: () => {
                    this.error.message = 'Ошибка удаления вакансии';
                }
            });
    }

    public cancelDeleting(): void {
        this.close(this.submitted);
    }
}

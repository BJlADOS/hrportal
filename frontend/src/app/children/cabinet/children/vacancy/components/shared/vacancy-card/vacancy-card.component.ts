import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IVacancy, VacancyService } from '../../../../../../../common';
import { DestroyService, ModalService } from '../../../../../../../lib';
import { UploadModalComponent } from '../../upload-modal/upload-modal.component';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';
import { DeleteVacancyComponent } from '../../modals/delete-vacancy/delete-vacancy.component';
import { finalize, takeUntil } from 'rxjs';
import { RemoveFromArchiveComponent } from '../../modals/remove-from-archive/remove-from-archive.component';


@Component({
    selector: 'app-vacancy-card',
    templateUrl: './vacancy-card.component.html',
    styleUrls: ['./vacancy-card.component.scss'],
    providers: [DestroyService],
})
export class VacancyCardComponent implements OnInit {

    @Input() public vacancy!: IVacancy;
    @Input() public status: Status = Status.public;

    @Output() public editedFromCard: EventEmitter<void> = new EventEmitter<void>();

    public description: string = '';

    constructor(
        public router: Router,
        private _modal: ModalService,
        private _vacancy: VacancyService,
        private _destroy$: DestroyService,
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

    public deleteVacancy(): void {
        this._modal.open(DeleteVacancyComponent, { vacancy: this.vacancy })
            .onResult()
            .pipe(finalize(() => this.editedFromCard.emit()))
            .subscribe();
    }

    public removeVacancyFromArchive(): void {
        this._modal.open(RemoveFromArchiveComponent, { vacancy: this.vacancy })
            .onResult()
            .pipe(finalize(() => this.editedFromCard.emit()))
            .subscribe();
    }

    protected readonly Status = Status;
}

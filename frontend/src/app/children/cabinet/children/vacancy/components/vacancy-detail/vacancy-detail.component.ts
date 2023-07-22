import {Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {finalize, Observable, takeUntil} from 'rxjs';
import {
    DepartmentService,
    IDepartment,
    ISkill,
    ISubmitError,
    IUser,
    IVacancy,
    IVacancyEdit,
    IVacancyFormError,
    IVacancyResponseModel,
    SkillsService,
    UserService,
    VacancyService
} from '../../../../../../common';
import {FormGroup} from '@angular/forms';
import {
    contentExpansion,
    DestroyService,
    Employment,
    FormGenerator,
    FormManager,
    getEmploymentRussianAsArray,
    getScheduleRussianAsArray,
    ISelectOption,
    ModalService
} from '../../../../../../lib';
import {UploadModalComponent} from '../upload-modal/upload-modal.component';
import {HttpErrorResponse} from '@angular/common/http';
import {Status} from '../../../../../../lib/utils/enums/status.enum';
import {ArchiveVacancyComponent} from '../modals/archive-vacancy/archive-vacancy.component';
import {RemoveFromArchiveComponent} from '../modals/remove-from-archive/remove-from-archive.component';
import {DeleteVacancyComponent} from '../modals/delete-vacancy/delete-vacancy.component';


@Component({
    selector: 'app-vacancy-detail',
    templateUrl: './vacancy-detail.component.html',
    styleUrls: ['./vacancy-detail.component.scss'],
    animations: [contentExpansion],
})
export class VacancyDetailComponent implements OnInit {

    public vacancy: IVacancy | null = null;
    public user$: Observable<IUser | null> = this._user.currentUser$;
    public vacancyForm!: FormGroup;
    public editor: any;
    public editorSettings: any = {
        icons: 'material',
        skin: 'borderless',
        menubar: false,
        menu: false,
        toolbar: false,
        statusbar: false,
    };

    public isEditing: boolean = false;
    public isAddingSkill: boolean = false;
    public isUserEdited: IVacancyEdit = {
        position: false,
        department: false,
        salary: false,
        employment: false,
        schedule: false,
        description: false,
        skills: false
    };

    public errors: IVacancyFormError = {
        position: null,
        salary: null,
        department: null,
        employment: null,
        schedule: null,
        description: null,
        requiredSkills: null
    };

    public submitError: ISubmitError | null = null;
    public isSubmitted: boolean = false;


    public departments$: Observable<IDepartment[]> = this._department.departments$;
    public schedule: ISelectOption[] = getScheduleRussianAsArray();
    public employment: ISelectOption[] = getEmploymentRussianAsArray();
    public skills$: Observable<ISkill[]> = this._skills.skills$;

    private _formManager: FormManager = FormManager.getInstance();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _destroy$: DestroyService,
        private _vacancy: VacancyService,
        private _modalServise: ModalService,
        private _user: UserService,
        private _form: FormGenerator,
        private _department: DepartmentService,
        private _skills: SkillsService,
        private _router: Router,
        private _injector: Injector
    ) { }

    public ngOnInit(): void {
        this._activatedRoute.paramMap
            .pipe(
                takeUntil(this._destroy$)
            ).subscribe({
                next: (paramMap: ParamMap) => {
                    const vacancyIdFromRoute: string = paramMap.get('id') as string;
                    this._vacancy.getVacancyById(vacancyIdFromRoute)
                        .pipe(
                            takeUntil(this._destroy$)
                        )
                        .subscribe({
                            next: (vacancy: IVacancy) => {
                                this.vacancy = vacancy;
                                this.vacancyForm = this._form.getVacancyForm(this.vacancy);
                                this.vacancyForm.disable();
                            },
                        });
                }
            });
    }

    public salaryChange(): void {
        this.errors.salary = this._formManager.checkSalary(this.vacancyForm);
    }

    public positionChange(): void {
        this.errors.position = this._formManager.checkPosition(this.vacancyForm);
    }

    public addedSkill(skill: ISkill): void {
        this.vacancyForm.controls['requiredSkills'].value.push(skill);
    }

    public deleteSkill(skill: ISkill): void {
        this.vacancyForm.controls['requiredSkills'].setValue(this.vacancyForm.controls['requiredSkills'].value.filter((s: ISkill) => s.id !== skill.id));
    }

    public editVacancy(): void {
        this.isEditing = true;
        this.isSubmitted = false;
        this.vacancyForm.enable();
    }

    public cancelEditing(): void {
        this.resetForm();
        this.isEditing = false;

        this.isUserEdited = {
            position: false,
            department: false,
            salary: false,
            employment: false,
            schedule: false,
            description: false,
            skills: false
        };

        this.errors = {
            position: null,
            salary: null,
            department: null,
            employment: null,
            schedule: null,
            description: null,
            requiredSkills: null
        };

        this.submitError = null;
        this.isAddingSkill = false;
    }

    public submitFormChanges(): void {
        const vacancyUpdate = this.createVacancyUpdateObject();
        this._vacancy.editVacancy(this.vacancy!.id.toString(), vacancyUpdate)
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (vacancy: IVacancyResponseModel) => {
                    this.vacancy = this._vacancy.updateVacancyObjectAfterEdit(this.vacancy!, vacancy);
                    this.cancelEditing();
                    this.isSubmitted = true;
                    this.isEditing = false;
                },
                error: (error: HttpErrorResponse) => {
                    this.submitError = { message: 'Ошибка изменения вакансии' };
                }
            });
    }

    public checkFormChanges(): boolean {
        const form = this.vacancyForm.value;
        const vacancy = this.vacancy;
        if (vacancy && form) {
            this.isUserEdited.description = form.description !== vacancy?.description;
            this.isUserEdited.salary = form.salary !== vacancy?.salary;
            this.isUserEdited.position = form.position !== vacancy?.position;
            this.isUserEdited.employment = form.employment !== vacancy?.employment;
            this.isUserEdited.schedule = form.schedule !== vacancy?.schedule;

            form.requiredSkills.forEach((skill: ISkill) => {
                if (!vacancy.requiredSkills.some((s: ISkill) => s.id === skill.id)) {
                    // Если в форме есть скилл, которого нет в юзере
                    //console.log('check passed added new');
                    this.isUserEdited.skills = true;

                    return;
                }
            });
            let sameSkillCounter: number = 0;
            vacancy.requiredSkills.forEach((skill: ISkill) => {
                if (!form.requiredSkills.some((s: ISkill) => s.id === skill.id)) {
                    // Если в форме нет скилла, который есть в юзере
                    //console.log('check passed deleted existing');
                    this.isUserEdited.skills = true;

                    return;
                } else {
                    sameSkillCounter++;
                }
            });
            // Если в форме и в юзере разное количество скиллов
            //console.log('check passed different length');
            this.isUserEdited.skills = vacancy.requiredSkills.length !== form.requiredSkills.length;

            // если нету добавленных и удаленных скиллов и количество скиллов в форме и в юзере одинаковое
            //console.log('check passed same length');
            this.isUserEdited.skills = !((sameSkillCounter === form.requiredSkills.length) && (sameSkillCounter === vacancy.requiredSkills.length));
        }

        // console.log(form.description);
        // console.log(vacancy?.description);
        // console.log(this.isUserEdited);

        return this.isUserEdited.description || this.isUserEdited.salary || this.isUserEdited.position || this.isUserEdited.department || this.isUserEdited.employment || this.isUserEdited.schedule || this.isUserEdited.skills;
    }

    public responseVacancy(): void {
        this._modalServise.open(
            UploadModalComponent,
            {
                vacancyId: this.vacancy?.id,
                vacancyName: this.vacancy?.position,
            },
            {
                injector: this._injector
            }
        );
    }

    public archiveVacancy(): void {
        this._modalServise.open(ArchiveVacancyComponent, { vacancy: this.vacancy })
            .onResult()
            .pipe(finalize(() => this.reloadVacancy()))
            .subscribe();
    }

    public removeVacancyFromArchive(): void {
        this._modalServise.open(RemoveFromArchiveComponent, { vacancy: this.vacancy })
            .onResult()
            .pipe(finalize(() => this.reloadVacancy()))
            .subscribe();
    }

    public deleteVacancy(): void {
        this._modalServise.open(DeleteVacancyComponent, { vacancy: this.vacancy })
            .onResult()
            .pipe(finalize(() => this.reloadVacancy()))
            .subscribe();
    }

    private reloadVacancy(): void {
        this._vacancy.getVacancyById(this.vacancy!.id.toString())
            .pipe(takeUntil(this._destroy$))
            .subscribe((vacancy: IVacancy) => {
                this.vacancy = vacancy;
            });
    }

    private resetForm(): void {
        this.vacancyForm = this._form.getVacancyForm(this.vacancy);
        this.vacancyForm.disable();
    }

    private createVacancyUpdateObject(): IVacancyResponseModel {
        const form = this.vacancyForm.value;
        const vacancyUpdate: IVacancyResponseModel = {};
        if (this.isUserEdited.position) {
            vacancyUpdate.position = form.position;
        }
        if (this.isUserEdited.salary) {
            vacancyUpdate.salary = form.salary;
        }
        if (this.isUserEdited.description) {
            vacancyUpdate.description = form.description;
        }
        if (this.isUserEdited.schedule) {
            vacancyUpdate.schedule = form.schedule.id;
        }
        if (this.isUserEdited.employment) {
            vacancyUpdate.employment = form.employment.id;
        }
        vacancyUpdate.requiredSkillsIds = (form.requiredSkills as ISkill[]).map((skill: ISkill) => skill.id);

        return vacancyUpdate;
    }

    protected readonly Status = Status;
}

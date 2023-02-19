import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { UserService } from '../../../../../../services/user.service';
import {
    getEmploymentRussianAsArray,
    getScheduleRussianAsArray,
    IVacancy,
    IVacancyResponseModel
} from '../../../../../../interfaces/vacancy';
import { IDepartment, ISkill, IUser } from '../../../../../../interfaces/User';
import { FormGenerator } from '../../../../../../classes/form-generator';
import { ISubmitError, IVacancyFormError } from '../../../../../../interfaces/errors';
import { DepartmentService } from '../../../../../../services/department.service';
import { FormManager } from '../../../../../../classes/form-manager';
import { SkillsService } from '../../../../../../services/skills.service';
import { ISelectOption } from '../../../../../../interfaces/select';
import { contentExpansion, contentExpansionHorizontal, DestroyService } from '../../../../../../lib';
import { VacancyService } from '../../services';

@Component({
    selector: 'app-create-vacancy',
    templateUrl: './create-vacancy.component.html',
    styleUrls: ['./create-vacancy.component.scss'],
    animations: [
        contentExpansionHorizontal,
        contentExpansion
    ]
})
export class CreateVacancyComponent implements OnInit {

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

    public isAddingSkill: boolean = false;
    public errors: IVacancyFormError = { position: null, salary: null, department: null, employment: null, schedule: null, description: null, requiredSkills: null };
    public submitError: ISubmitError | null = null;
    public isSubmitted: boolean = false;


    public departments$: Observable<IDepartment[]> = this._department.departments$;
    public schedule: ISelectOption[] = getScheduleRussianAsArray();
    public employment: ISelectOption[] = getEmploymentRussianAsArray();
    public skills$: Observable<ISkill[]> = this._skills.skills$;

    private _formManager: FormManager = FormManager.getInstance();

    constructor(
    private _destroy$: DestroyService,
    private _vacancy: VacancyService,
    private _user: UserService,
    private _form: FormGenerator,
    private _department: DepartmentService,
    private _skills: SkillsService,
    private _router: Router,
    ) { }

    public ngOnInit(): void {
        this.vacancyForm = this._form.getVacancyForm(null);
        this.vacancyForm.enable();
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

    public createVacancy(): void {
        const vacancyUpdate = this.createVacancyUpdateObject();

        this._vacancy.createVacancy(vacancyUpdate)
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (vacancy: IVacancy) => {
                    this.isSubmitted = true;
                    this.submitError = null;

                    this._router.navigate([`cabinet/vacancies/${vacancy.id}`]);
                },
                error: (error: HttpErrorResponse) => {
                    this.submitError = { message: 'Ошибка создания вакансии' };
                }
            });
    }

    public getDepartment(departments: IDepartment[], user: IUser): string {
        return departments.find((department: IDepartment) => department.managerId === user.id)?.name || '';
    }

    private createVacancyUpdateObject(): IVacancyResponseModel {
        const form = this.vacancyForm.value;
        const vacancyUpdate: IVacancyResponseModel = {};
        vacancyUpdate.position = form.position;
        vacancyUpdate.salary = form.salary;
        vacancyUpdate.description = form.description;
        vacancyUpdate.schedule = form.schedule.id;
        vacancyUpdate.employment = form.employment.id;
        vacancyUpdate.requiredSkillsIds = (form.requiredSkills as ISkill[]).map((skill: ISkill) => skill.id);

        return vacancyUpdate;
    }

}

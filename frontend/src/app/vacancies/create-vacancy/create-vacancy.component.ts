import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { contentExpansionHorizontal } from 'src/app/animations/content-expansion/content-expansion-horizontal';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { IVacancyEditing } from 'src/app/interfaces/editing';
import { IVacancyFormError, ISubmitError } from 'src/app/interfaces/errors';
import { ISelectOption } from 'src/app/interfaces/select';
import { IUser, IDepartment, ISkill } from 'src/app/interfaces/User';
import { IVacancy, getScheduleRussianAsArray, getEmploymentRussianAsArray, IVacancyResponseModel } from 'src/app/interfaces/vacancy';
import { DepartmentService } from 'src/app/services/department/department.service';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SkillsService } from 'src/app/services/skills/skills.service';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-create-vacancy',
  templateUrl: './create-vacancy.component.html',
  styleUrls: ['./create-vacancy.component.scss'],
  animations: [contentExpansionHorizontal, contentExpansion]
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
  }

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
    console.log(this.vacancyForm);
  }

  public addedSkill(skill: ISkill): void {
    this.vacancyForm.controls['requiredSkills'].value.push(skill);
  }

  public deleteSkill(skill: ISkill): void {
    this.vacancyForm.controls['requiredSkills'].setValue(this.vacancyForm.controls['requiredSkills'].value.filter((s: ISkill) => s.id !== skill.id));
  }

  public createVacancy(): void {
    const vacancyUpdate = this.createVacancyUpdateObject();

    this._vacancy.createVacancy(vacancyUpdate).pipe(takeUntil(this._destroy$)).subscribe({
      next: (vacancy: IVacancy) => {
        this.isSubmitted = true;
        this.submitError = null;

        this._router.navigate([`/vacancies/${vacancy.id}`]);
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
    const vacancyUpdate: IVacancyResponseModel = {}
    vacancyUpdate.position = form.position;
    vacancyUpdate.salary = form.salary;
    vacancyUpdate.description = form.description;
    vacancyUpdate.schedule = form.schedule.id;
    vacancyUpdate.employment = form.employment.id;
    vacancyUpdate.requiredSkillsIds = (form.requiredSkills as ISkill[]).map((skill: ISkill) => skill.id);

    return vacancyUpdate;
  }

}

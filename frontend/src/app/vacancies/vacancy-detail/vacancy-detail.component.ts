import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription, takeUntil } from 'rxjs';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { IDepartment, ISkill, IUser } from 'src/app/interfaces/User';
import { getEmploymentRussianAsArray, getScheduleRussianAsArray, IVacancy } from 'src/app/interfaces/vacancy';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';
import { UploadModalComponent } from '../upload-modal/upload-modal.component';
import { IVacancyEditing } from 'src/app/interfaces/editing';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormGroup } from '@angular/forms';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { DepartmentService } from 'src/app/services/department/department.service'
import { ISelectOption } from 'src/app/interfaces/select';
import { SkillsService } from 'src/app/services/skills/skills.service';
import { ISubmitError, IVacancyFormError } from 'src/app/interfaces/errors';
import { FormManager } from 'src/app/classes/form-manager/form-manager';

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
  }

  public isEditing: boolean = false;
  public isAddingSkill: boolean = false;
  public isUserEdited: IVacancyEditing = { position: false, department: false, salary: false, employment: false, schedule: false, description: false, skills: false };
  public errors: IVacancyFormError = { position: null, salary: null, department: null, employment: null, schedule: null, description: null, requiredSkills: null };
  public submitError: ISubmitError | null = null; 


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
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
      const vacancyIdFromRoute: string = paramMap.get('id') as string;
      this._vacancy.getVacancyById(vacancyIdFromRoute).pipe(takeUntil(this._destroy$)).subscribe((vacancy: IVacancy) => {
        this.vacancy = vacancy;
        this.vacancyForm = this._form.getVacancyForm(this.vacancy);
        this.vacancyForm.disable();
      }
      );
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

  public checkFormChanges(): boolean {
    return false;
  }

  public editVacancy(): void {
    this.isEditing = true;
    this.vacancyForm.enable();
  }

  public cancelEditing(): void {
    this.resetForm();
    this.isEditing = false;
    this.isUserEdited = { position: false, department: false, salary: false, employment: false, schedule: false, description: false, skills: false };
    this.errors = { position: null, salary: null, department: null, employment: null, schedule: null, description: null, requiredSkills: null };
    this.submitError = null;
    this.isAddingSkill = false;
  }

  public responseVacancy(): void {
    const modalRef: ModalRef = this._modalServise.open(UploadModalComponent, {
      vacancyId: this.vacancy?.id,
      vacancyName: this.vacancy?.position,
    });
  }

  private resetForm(): void {
    this.vacancyForm = this._form.getVacancyForm(this.vacancy);
    this.vacancyForm.disable();
  }

}

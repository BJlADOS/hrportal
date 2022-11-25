import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { Modal } from 'src/app/classes/modal/modal';
import { IResumeEditing } from 'src/app/interfaces/editing';
import { IResumeFormError } from 'src/app/interfaces/errors';
import { IResume, IResumeUpdate } from 'src/app/interfaces/resume';
import { ISelectOption } from 'src/app/interfaces/select';
import { Employment, getEmploymentRussianAsArray, getScheduleRussianAsArray, Schedule } from 'src/app/interfaces/vacancy';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-resume',
  templateUrl: './create-resume.component.html',
  styleUrls: ['./create-resume.component.scss'],
  animations: [contentExpansion],
})
export class CreateResumeComponent extends Modal implements OnInit {

  public isSubmitted: boolean = false;
  public resumeForm!: FormGroup;
  public schedule: ISelectOption[] = getScheduleRussianAsArray();
  public employment: ISelectOption[] = getEmploymentRussianAsArray();
  public errors: IResumeFormError = { desiredPosition: null, desiredSalary: null, desiredEmployment: null, desiredSchedule: null };

  public resume: IResume | null = null;
  public uploadError: string | undefined;
  public file: File | null = null;
  public loadPlaceholder: string | undefined;

  private isUserChanged: IResumeEditing = { desiredPosition: false, desiredSalary: false, desiredEmployment: false, desiredSchedule: false, resume: false };

  private _formManager: FormManager = FormManager.getInstance();

  constructor(
    private _formGenerator: FormGenerator,
    private _user: UserService,
    private _http: HttpClient,
  ) {
    super();
  }
  public ngOnInit(): void {
    this._user.getResume().subscribe({ next: (resume: IResume) => {
      this.resume = resume;
      //Парсим имя файла из ссылки или ставим заглушку
      this.loadPlaceholder = resume.resume.split('/').pop();
      this.resumeForm = this._formGenerator.getResumeForm(this.resume);
    }, error: (error: any) => {
      this.resumeForm = this._formGenerator.getResumeForm(null);
      this.loadPlaceholder = 'Загрузить';
    }});
  }

  public onInjectInputs(inputs: any): void {

  }

  public positionChange(): void {
    this.errors.desiredPosition = this._formManager.checkPosition(this.resumeForm);
  }

  public salaryChange(): void {
    this. errors.desiredSalary = this._formManager.checkSalary(this.resumeForm);
  }

  public employmentChange(): void {
    this.errors.desiredEmployment = this._formManager.checkEmployment(this.resumeForm);
  }

  public scheduleChange(): void {
    this.errors.desiredSchedule = this._formManager.checkSchedule(this.resumeForm);
  }

  public submit(): void {
    const resume: IResumeUpdate = this.createUpdateResumeObject();

    if (this.resume) {
      this._user.updateResume(resume).subscribe({ next: (resume: IResume) => {
        this.isSubmitted = true;
      }, error: (error: any) => {
        //console.log(error);
      }});
    } else {
      this._user.createResume(resume).subscribe({ next: (resume: IResume) => {
        this.isSubmitted = true;
      }, error: (error: any) => {
        //console.log(error);
      }});
    }
  }


  public fileChange(event: any): void {
    const file: File = event.target.files[0];
    this.checkFile(file);
    this.file = file;
  }

  public back(): void {
    this.close();
  }

  public checkFileLoaded(): boolean {
    return this.file !== null || this.resume !== null;
  }

  public checkFormChanges(): boolean {
    const form = this.resumeForm.value;
    const resume = this.resume;

    this.isUserChanged.desiredPosition = form.desiredPosition !== resume?.desiredPosition;
    this.isUserChanged.desiredSalary = form.desiredSalary !== resume?.desiredSalary;
    this.isUserChanged.desiredEmployment = (form.desiredEmployment.id?? form.desiredEmployment) !== resume?.desiredEmployment;
    this.isUserChanged.desiredSchedule = (form.desiredSchedule.id?? form.desiredSchedule) !== resume?.desiredSchedule;
    this.isUserChanged.resume = this.file !== null || this.loadPlaceholder !== resume?.resume?.split('/').pop();

    return this.isUserChanged.desiredPosition || this.isUserChanged.desiredSalary || this.isUserChanged.desiredEmployment || this.isUserChanged.desiredSchedule || this.isUserChanged.resume;
  } 

  private checkFile(file: File): boolean {
    if (file.type !== 'application/pdf') {
      this.uploadError = 'Неверный формат файла';
      return false;
    }
    if (file.size > 4194304) {
      this.uploadError = 'Файл слишком большой';
      return false;
    }

    this.uploadError = undefined;
    return true;
  }

  private createUpdateResumeObject(): IResumeUpdate {
    console.log(this.file);
    const resume: IResumeUpdate = {
      desiredPosition: this.resumeForm.value.desiredPosition as string,
      desiredSalary: parseInt(this.resumeForm.value.desiredSalary),
      desiredEmployment: (this.resumeForm.value.desiredEmployment.id?? this.resumeForm.value.desiredEmployment) as Employment,
      desiredSchedule: (this.resumeForm.value.desiredSchedule.id?? this.resumeForm.value.desiredSchedule) as Schedule,
      isActive: this.resumeForm.value.isActive as boolean,
      resume: this.file!,
    };

    return resume;
  }
}

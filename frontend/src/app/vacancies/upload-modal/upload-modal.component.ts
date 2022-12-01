import { Component } from '@angular/core';
import { Observer } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { Modal } from 'src/app/classes/modal/modal';
import { IResume } from 'src/app/interfaces/resume';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
  animations: [contentExpansion],
})
export class UploadModalComponent extends Modal {

  public vacancyName: string = '';
  public file: File | null = null;
  public isSubmitted: boolean = false;
  public submitTypeSelected: boolean = false;
  public resume!: IResume;

  private _vacancyId: string = '';
  public uploadError: string | undefined;

  constructor(
    private _vacancy: VacancyService,
    private _user: UserService,
  ) { 
    super();
  }

  public ngOnInit(): void {
    this._user.getResume().subscribe({ next: (resume: IResume) => {
      this.resume = resume;
    }, error: () => {
    }});
  }

  public changeSubmitType(): void {
    this.submitTypeSelected = true;
  }

  public backToSelectType(): void {
    this.submitTypeSelected = false;
    this.file = null;
    this.uploadError = undefined;
  }

  public onInjectInputs(inputs: any): void {
    this._vacancyId = inputs.vacancyId;
    this.vacancyName = inputs.vacancyName;
  }

  public closeModal(): void {
    this.close();
  }

  public onFileChange(event: any): void {
    const file: File = event.target.files[0];
    this.checkFile(file);
    this.file = file;
  }

  public onFileDropped(files: FileList): void {
    this.checkFile(files.item(0)!);
    this.file= files.item(0);
  }

  public sendReadyResume(): void {
    this.isSubmitted = true;
    this._vacancy.responseToVacancyWithReadyResume(this._vacancyId, this.resume.id);
  }

  public uploadFile(): void {
    this._vacancy.responseToVacancy(this._vacancyId, this.file!);
    this.isSubmitted = true;
  }

  public getUsername(): string {
    return this._user.getUserName();
  }

  public getUserEmail(): string {
    return this._user.currentUserValue?.email || '';
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

}

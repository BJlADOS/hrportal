import { Component } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { Modal } from 'src/app/classes/modal/modal';
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

  private _vacancyId: string = '';
  public uploadError: string | undefined;

  constructor(
    private _vacancy: VacancyService,
    private _user: UserService,
  ) { 
    super();
  }

  public ngOnInit(): void {
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
    if (!this.checkFile(file)) {
      return;
    }
    this.file = file;
    this.uploadError = undefined;
  }

  public onFileDropped(files: FileList): void {
    if (!this.checkFile(files.item(0)!)) {
      return;
    }
    this.file= files.item(0);
    this.uploadError = undefined;
  }

  public uploadFile(): void {
    this._vacancy.responseToVacancy(this._vacancyId, this.file);
    this.isSubmitted = true;
  }

  public getUsername(): string {
    const surname: string = this._user.currentUserValue?.fullname.split(' ')[0] || '';
    const firstName: string = this._user.currentUserValue?.fullname.split(' ')[1] || '';
    return `${firstName} ${surname}`;
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

    return true;
  }

}

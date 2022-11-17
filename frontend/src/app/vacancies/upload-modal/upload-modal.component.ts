import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { Modal } from 'src/app/classes/modal/modal';
import { UserService } from 'src/app/services/user/user.service';
import { VacancyService } from 'src/app/services/vacancy/vacancy.service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent extends Modal {

  public vacancyName: string = '';
  public file: File | null = null;
  public isSubmitted: boolean = false;

  private _vacancyId: string = '';

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
    console.log(event.target);
    const file: File = event.target.files[0];
    this.file = file;
    console.log(file);
  }

  public onFileDropped(files: FileList): void {
    this.file= files.item(0);
  }

  public uploadFile(): void {
    this._vacancy.responseToVacancy(this._vacancyId, this.file).subscribe(
      { next: (response: any) => {
        this.isSubmitted = true;
        console.log(response);
      } }
    );
    
  }

  public getUsername(): string {
    const surname: string = this._user.currentUserValue?.fullname.split(' ')[0] || '';
    const firstName: string = this._user.currentUserValue?.fullname.split(' ')[1] || '';
    return `${firstName} ${surname}`;
  }

  public getUserEmail(): string {
    return this._user.currentUserValue?.email || '';
  }

}

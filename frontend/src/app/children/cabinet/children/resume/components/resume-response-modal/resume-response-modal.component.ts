import { Component } from '@angular/core';
import { Modal } from 'src/app/classes/modal/modal';
import { IResume } from 'src/app/interfaces/resume';
import { UserService } from '../../../../../../services/user.service';

@Component({
    selector: 'app-resume-response-modal',
    templateUrl: './resume-response-modal.component.html',
    styleUrls: ['./resume-response-modal.component.scss']
})
export class ResumeResponseModalComponent extends Modal {

    public resume: IResume | null = null;
    public employeeName: string = '';
    public employeeEmail: string = '';

    constructor(
        private _user: UserService,
    ) {
        super();
    }

    public onInjectInputs(inputs: any): void {
        this.resume = inputs.resume;
        this.employeeName = inputs.employeeName;
        this.employeeEmail = inputs.employeeEmail;
    }

    public getUserName(): string {
        return this._user.getUserName();
    }

}

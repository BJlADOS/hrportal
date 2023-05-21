import { Component } from '@angular/core';
import { IResume, UserService } from '../../../../../../common';
import { Modal } from '../../../../../../lib/ui-modals/classes/modal';

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

import { Component } from '@angular/core';
import { DepartmentService, IDepartment } from '../../../../../../common';
import { Modal } from '../../../../../../lib';

@Component({
    selector: 'app-archive-department-modal',
    templateUrl: './archive-department-modal.component.html',
    styleUrls: ['./archive-department-modal.component.scss']
})
export class ArchiveDepartmentModalComponent extends Modal {

    public department!: IDepartment;

    constructor(
        private _department: DepartmentService,
    ) {
        super();
    }

    public onInjectInputs(inputs: any): void {
        this.department = inputs.department;
    }

    public archiveDepartment(): void {
        console.log('archiveDepartment()');
    }

    public cancelArchive(): void {
        this.close();
    }

}

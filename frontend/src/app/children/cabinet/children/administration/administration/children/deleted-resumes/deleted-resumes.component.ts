/* eslint-disable @typescript-eslint/typedef */
import { Component, OnInit } from '@angular/core';
import { Status } from '../../../../../../../lib/utils/enums/status.enum';

@Component({
    selector: 'app-deleted-resumes',
    templateUrl: './deleted-resumes.component.html',
    styleUrls: ['./deleted-resumes.component.scss']
})
export class DeletedResumesComponent implements OnInit {

    public readonly status = Status;

    constructor() { }

    public ngOnInit(): void {
    }


}

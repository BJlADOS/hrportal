import { Component, OnInit } from '@angular/core';
import { IResume, ResumeService } from '../../../../../../common';

@Component({
    selector: 'app-resume-list',
    templateUrl: './resume-list.component.html',
    styleUrls: ['./resume-list.component.scss']
})
export class ResumeListComponent implements OnInit {

    public resumes: IResume[] = [];
    public loadingError: string | undefined;

    constructor(
        private _resume: ResumeService,
    ) { }

    public ngOnInit(): void {
        this._resume.getResumes()
            .subscribe({
                next: (data) => {
                    this.resumes = data;
                }, error: (err) => {
                    this.loadingError = err;
                }
            });
    }

}

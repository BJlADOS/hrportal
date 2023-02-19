import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IResume } from 'src/app/interfaces/resume';
import { ISkill, IUser } from 'src/app/interfaces/User';
import { ResumeResponseModalComponent } from '../resume-response-modal/resume-response-modal.component';
import { UserService } from '../../../../../../services/user.service';
import { ResumeService } from '../../services';
import { ModalService } from '../../../../../../services/modal.service';

@Component({
    selector: 'app-resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
    @Input() public resume!: IResume;

    public user: IUser | null = null;

    constructor(
        private _userService: UserService,
        private _router: Router,
        private _resume: ResumeService,
        private _modal: ModalService,
    ) { }

    public ngOnInit(): void {
        this._userService.getUserById(this.resume.employeeId).subscribe({
            next: (user: IUser) => {
                this.user = user;
            }
        });
    }

    public skillsToString(skills: ISkill[]): string {
        return skills.map((skill: ISkill) => skill.name).join(', ');
    }

    public openResume(): void {
        this._router.navigate([`cabinet/resumes/${this.resume.id}`]);
    }

    public responseResume(): void {
        this._modal.open(ResumeResponseModalComponent, {
            resume: this.resume,
            employeeName: this.user?.fullname,
            employeeEmail: this.user?.email,
        });
        this._resume.responseToResume(this.resume!.id);
    }
}

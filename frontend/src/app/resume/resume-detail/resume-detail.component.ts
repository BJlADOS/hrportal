import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { IResume } from 'src/app/interfaces/resume';
import { IUser } from 'src/app/interfaces/User';
import { Employment, Experience, IVacancy, Schedule } from 'src/app/interfaces/vacancy';
import { DestroyService } from 'src/app/services/destoy/destroy.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ResumeService } from 'src/app/services/resume/resume.service';
import { UserService } from 'src/app/services/user/user.service';
import { ResumeResponseModalComponent } from '../resume-response-modal/resume-response-modal.component';

@Component({
  selector: 'app-resume-detail',
  templateUrl: './resume-detail.component.html',
  styleUrls: ['./resume-detail.component.scss']
})
export class ResumeDetailComponent implements OnInit {

  public resume: IResume | null = null;
  public employee: IUser | null = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _destroy$: DestroyService,
    private _resume: ResumeService,
    private _user: UserService,
    private _modal: ModalService,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._destroy$)).subscribe((paramMap: ParamMap) => {
      const resumeIdFromRoute: string = paramMap.get('id') as string;
      this._resume.getResumeById(resumeIdFromRoute).pipe(takeUntil(this._destroy$)).subscribe({
        next: (resume: IResume) => {
          this.resume = resume;

          this._user.getUserById(resume.employeeId).pipe(takeUntil(this._destroy$)).subscribe((user: IUser) => {
            this.employee = user;
          }
          );
        },
        error: () => {
          this._router.navigate(['/resumes']);
        }
      });
    });
  }

  public responseToResume(): void {
    this._modal.open(ResumeResponseModalComponent, {
      resume: this.resume,
      employeeName: this.employee?.fullname,
      employeeEmail: this.employee?.email,
    });
    this._resume.responseToResume(this.resume!.id);
  }

  public showResume(): void {
    window.open(this.resume?.resume);
  }

}

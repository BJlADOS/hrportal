import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, catchError } from 'rxjs';
import { IResume } from 'src/app/interfaces/resume';
import { ResumeService } from './resume.service';

@Injectable({
    providedIn: 'root'
})
export class ResumeResolverService {

    constructor(
        private _resume: ResumeService,
        private _router: Router,
    ) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        const resumeId: string = route.paramMap.get('id') as string;

        return this._resume.getResumeById(resumeId)
            .pipe(
                map((data: IResume) => data.desiredPosition),
                catchError(() => this._router.navigate(['cabinet/resumes']))
            ) as Observable<string>;
    }
}

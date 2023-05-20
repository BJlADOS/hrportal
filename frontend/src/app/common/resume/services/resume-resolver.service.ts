import { Injectable, isDevMode } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map, catchError, EMPTY } from 'rxjs';
import { ResumeService } from './resume.service';
import { IResume } from '../interfaces';
import { Location } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ResumeResolverService {

    constructor(
        private _resume: ResumeService,
        private _router: Router,
        private _location: Location,
    ) { }

    public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
        const resumeId: string = route.paramMap.get('id') as string;

        return this._resume.getResumeById(resumeId)
            .pipe(
                map((data: IResume) => data.desiredPosition),
                catchError((error: any) => {
                    if (isDevMode()) {
                        console.log(error);
                    }

                    this._router.navigate([this._router.url]);

                    return EMPTY;
                })
            ) as Observable<string>;
    }
}

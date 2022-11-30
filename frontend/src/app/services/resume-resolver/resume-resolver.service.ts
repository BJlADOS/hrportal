import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { IResume } from 'src/app/interfaces/resume';
import { ResumeService } from '../resume/resume.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeResolverService {

  constructor(
    private _resume: ResumeService,
  ) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const resumeId: string = route.paramMap.get('id') as string;
    // return this._resume.getResumeById(resumeId).pipe(map((data: IResume) => data.desiredPosition));
    return of('hi');
  }
}

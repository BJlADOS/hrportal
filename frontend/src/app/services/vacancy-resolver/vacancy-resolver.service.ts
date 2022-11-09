import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IVacancy } from 'src/app/interfaces/vacancy';
import { VacancyService } from '../vacancy/vacancy.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyResolverService {

  constructor(
    private _vacancy: VacancyService
  ) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    const vacancyId: string = route.paramMap.get('id') as string;
    return this._vacancy.getVacancyById(vacancyId).pipe(map((data: IVacancy) => data.position));
  }
}

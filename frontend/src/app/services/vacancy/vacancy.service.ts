import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVacancy } from 'src/app/interfaces/vacancy';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private _apiUrl = environment.apiURL;

  constructor(
    public http: HttpClient,
    
  ) { }

  public getVacancies(): Observable<IVacancy[]> {
    return this.http.get<IVacancy[]>(`${this._apiUrl}/vacancies`);
  }

  public getVacancyById(vacancyId: string): Observable<IVacancy> {
    return this.http.get<IVacancy>(`${this._apiUrl}/vacancies/${vacancyId}`);
  }

  public responseToVacancy(vacancyId: string, resume: any): Observable<Object> { //fix resume type
    const formData = new FormData();
    formData.append('resume', resume);
    return this.http.post(`${this._apiUrl}/vacancies/${vacancyId}/response`, formData);
  }

}

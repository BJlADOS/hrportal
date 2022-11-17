import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVacancy, IVacancyResponseModel } from 'src/app/interfaces/vacancy';
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

  public deleteVacancy(vacancyId: string): Observable<Object> {
    return this.http.delete(`${this._apiUrl}/vacancies/${vacancyId}`);
  }

  public editVacancy(vacancyId: string, vacancy: IVacancyResponseModel): Observable<Object> {
    return this.http.patch(`${this._apiUrl}/vacancies/${vacancyId}`, vacancy);
  }

  //TODO: fix resume type
  public responseToVacancy(vacancyId: string, resume: any): Observable<Object> { 
    const formData = new FormData();
    formData.append('resume', resume);
    return this.http.post(`${this._apiUrl}/vacancies/${vacancyId}/response`, formData);
  }

  public createVacancy(vacancy: IVacancyResponseModel): Observable<Object> {
    return this.http.post(`${this._apiUrl}/vacancies`, vacancy);
  }

}

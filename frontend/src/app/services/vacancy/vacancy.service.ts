import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IVacancy, IVacancyResponseModel } from 'src/app/interfaces/vacancy';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {

  private _apiUrl = environment.apiURL;

  constructor(
    public http: HttpClient,
    private _user: UserService,
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

  public editVacancy(vacancyId: string, vacancy: IVacancyResponseModel): Observable<IVacancy> {
    const formData = this._user.parseToFormData(vacancy);

    return this.http.patch<IVacancy>(`${this._apiUrl}/vacancies/${vacancyId}/`, formData);
  }

  public responseToVacancy(vacancyId: string, resume: File): void { 
    const formData = new FormData();
    formData.append('resume', resume);
    this.http.post(`${this._apiUrl}/vacancies/${vacancyId}/response`, formData).subscribe({ next: (data) => {
      console.log(data);
    }
    });
  }

  public responseToVacancyWithReadyResume(vacancyId: string, resumeId: number): void {
    this.http.post(`${this._apiUrl}/vacancies/${vacancyId}/response`, {}, { params: { resumeId } }).subscribe({ next: (data) => {
      console.log(data);
    } });
  }

  public createVacancy(vacancy: IVacancyResponseModel): Observable<Object> {
    return this.http.post(`${this._apiUrl}/vacancies`, vacancy);
  }

}

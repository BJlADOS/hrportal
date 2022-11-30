import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResume } from 'src/app/interfaces/resume';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  constructor(
    private _http: HttpClient,
  ) { }

  public getResumes(): Observable<IResume[]> {
    return this._http.get<IResume[]>(`${environment.apiURL}/resumes`);
  }

  public getResumeById(id: string): Observable<IResume> {
    return this._http.get<IResume>(`${environment.apiURL}/resumes/${id}`);
  }

  public responseToResume(id: string): Observable<IResume> {
    return this._http.post<IResume>(`${environment.apiURL}/resumes/${id}/response`, {}, { params: { id } });
  }
}

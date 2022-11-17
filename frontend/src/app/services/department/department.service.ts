import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { IDepartment } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  public apiUrl: string = environment.apiURL;

  constructor(
    public http: HttpClient,
  ) { }

  public getDepartments(): Observable<IDepartment[]> {
    return this.http.get(`${this.apiUrl}/departments`) as Observable<IDepartment[]>;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IDepartment } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  public apiUrl: string = environment.apiURL;

  public departmentsSubject$: BehaviorSubject<IDepartment[]> = new BehaviorSubject<IDepartment[]>([]);
  public departments$: Observable<IDepartment[]> = this.departmentsSubject$.asObservable(); 

  constructor(
    public http: HttpClient,
  ) { }

  public getDepartments(): Observable<IDepartment[]> {
    this.http.get<IDepartment[]>(`${this.apiUrl}/departments`).subscribe({
      next: (departments: IDepartment[]) => {
        this.departmentsSubject$.next(departments);
      }
    });

    return this.http.get(`${this.apiUrl}/departments`) as Observable<IDepartment[]>;
  }
}

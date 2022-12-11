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

  public getDepartments(): void {
    this.http.get<IDepartment[]>(`${this.apiUrl}/departments`).subscribe({
      next: (departments: IDepartment[]) => {
        this.departmentsSubject$.next(departments);
      }
    });
  }

  public createDepartment(department: IDepartment): Observable<IDepartment> {
    return this.http.post<IDepartment>(`${this.apiUrl}/departments/`, department);
  }
}

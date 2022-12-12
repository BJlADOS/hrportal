import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IDepartment, IDepartmentUpdate } from 'src/app/interfaces/User';
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

  public createDepartment(department: IDepartmentUpdate): Observable<IDepartment> {
    return this.http.post<IDepartment>(`${this.apiUrl}/departments/`, department);
  }

  public editDepartment(department: IDepartmentUpdate, id: number): Observable<IDepartment> {
    return this.http.patch<IDepartment>(`${this.apiUrl}/departments/${id}/`, department);
  }

  public deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/departments/${id}/`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public currentUserSubject$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public currentUser$: Observable<IUser | null> = this.currentUserSubject$.asObservable();

  private _apiURL: string = environment.apiURL;

  constructor(
    public http: HttpClient,
  ) { }

  public get currentUserValue(): IUser | null { //placeholder
    return { fullname: 'test', email: 'test', contact: 'test', expirience: 1, currentDepartment: { id: 1, name: 'test', managerId: 1 }, photo: 'test', existingSkills: [{ id: 1, name: 'test' }], isManager: true, isAdmin: true, id: 1, filled: true, resumeId: 1 };
  }

  public getUserInfo(): void {
    this.http.get(`${this._apiURL}/user`).subscribe((data) => {
      this.currentUserSubject$.next(data as IUser);
    });
  }

  public logOut(): void {
    this.currentUserSubject$.next(null);
  }
}

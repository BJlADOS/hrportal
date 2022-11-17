import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, IUserUpdate } from 'src/app/interfaces/User';
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

  public get currentUserValue(): IUser | null { 
    return this.currentUserSubject$.value;
  }

  public getUserInfo(): void {
    this.http.get(`${this._apiURL}/user`).subscribe({ next: (data) => {
      this.currentUserSubject$.next(data as IUser);
    } });
  }

  public updateUserInfo(user: IUserUpdate): void { //put inside component that updates user info
    this.http.patch(`${this._apiURL}/user`, user).subscribe({ next: (data) => {
      this.currentUserSubject$.next(data as IUser);
    } });
  }

  public getUserById(id: number): Observable<IUser> {
    return this.http.get(`${this._apiURL}/user/${id}`) as Observable<IUser>;
  }

  public logOut(): void {
    this.currentUserSubject$.next(null);
  }
}

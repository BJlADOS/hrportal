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

  public updateCurrentUser(user: IUser): void {
    this.currentUserSubject$.next(this.fixPhotoUrl(user));
  }

  public getUserInfo(): void {
    this.http.get(`${this._apiURL}/user`).subscribe({ next: (data) => {
      const user = data as IUser;
      this.currentUserSubject$.next(this.fixPhotoUrl(user));
    } });
  }

  public updateUserInfo(user: any): Observable<IUser> {
    const data = new FormData();
    Object.keys(user).forEach((key, i) => {
      if (Object.values(user)[i]) {
        data.append(key, Object.values(user)[i] as string | Blob); 
      }
    });
    return this.http.patch(`${this._apiURL}/user/`, data) as Observable<IUser>;
  }

  public getUserById(id: number): Observable<IUser> {
    return this.http.get(`${this._apiURL}/user/${id}`) as Observable<IUser>;
  }

  public logOut(): void {
    this.currentUserSubject$.next(null);
  }

  private fixPhotoUrl(user: IUser): IUser {
    if (user.photo) {
      user.photo = `${this._apiURL}${user.photo}`;
    }
    return user;
  }
}

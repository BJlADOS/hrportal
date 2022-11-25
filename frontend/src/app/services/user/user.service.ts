import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IResume, IResumeUpdate } from 'src/app/interfaces/resume';
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

  public updateUserInfo(user: IUserUpdate): Observable<IUser> {
    const data = this.parseToFormData(user);
    
    return this.http.patch(`${this._apiURL}/user/`, data) as Observable<IUser>;
  }

  public getUserById(id: number): Observable<IUser> {
    return this.http.get(`${this._apiURL}/user/${id}`) as Observable<IUser>;
  }

  public getResume(): Observable<IResume> {
    return this.http.get(`${this._apiURL}/user/resume`) as Observable<IResume>;
  }

  public createResume(resume: IResumeUpdate): Observable<IResume> {
    const data = this.parseToFormData(resume);
    return this.http.post(`${this._apiURL}/user/resume/`, data) as Observable<IResume>;
  }

  public updateResume(resume: IResumeUpdate): Observable<IResume> {
    const data = this.parseToFormData(resume);
    return this.http.patch(`${this._apiURL}/user/resume/`, data) as Observable<IResume>;
  }
    
  public getUserName(): string {
    return `${this.currentUserValue?.fullname.split(' ')[0]} ${this.currentUserValue?.fullname.split(' ')[1]}`;
  }

  public logOut(): void {
    this.currentUserSubject$.next(null);
  }

  private parseToFormData(data: any): FormData {
    const formData = new FormData();
    Object.keys(data).forEach((key, i) => {
      if (Object.values(data)[i]) {
        Array.isArray(Object.values(data)[i]) ? (Object.values(data)[i] as Array<any>).forEach((element: any) => {
          formData.append(key, element);
        }) : formData.append(key, Object.values(data)[i] as string | Blob);
        console.log(formData.get(key));
      }
    });
    return formData;
  }


  private fixPhotoUrl(user: IUser): IUser {
    if (user.photo) {
      user.photo = `${this._apiURL}${user.photo}`;
    }
    return user;
  }
}

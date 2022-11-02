import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SHA256 } from 'crypto-js';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { IToken, IValidToken } from 'src/app/interfaces/Token';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public currentUserSubject: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(null);
  public currentUser: Observable<IUser | null> = this.currentUserSubject.asObservable();

  private apiURL: string = environment.apiURL;

  constructor(
    public http: HttpClient,
    private cookie: CookieService,
    ) { 
    }

  public get currentUserValue(): IUser | null { //placeholder
    return { fullname: 'test', email: 'test', contact: 'test', expirience: 1, currentDepartment: { id: 1, name: 'test', managerId: 1 }, photo: 'test', existingSkills: [{ id: 1, name: 'test' }], isManager: true, isAdmin: true, id: 1, filled: true, resumeId: 1 };
  }

  public signUp(fullname: string, email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${ this.apiURL }/reg`, { fullname: fullname, email: email, password: passwordHash  }).subscribe((data) => {
      console.log(data);
    });
  }

  public signIn(email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${this.apiURL}/auth`, { email: email, password: passwordHash }).subscribe((data) => {
      const token: IToken = data as IToken;
      this.cookie.put('token', token.token);
      this.validateToken();
    });
  }

  public checkEmail(email: string): Observable<object> {
    return this.http.post(`${this.apiURL}/enique-email`, { email: email });
  }

  public logOut(): void { 
    this.currentUserSubject.next(null);
    this.cookie.remove('token');
  }

  public init(): void {
    if (this.cookie.get('token')) {
      this.validateToken();
    }
  }

  private validateToken(): void { //placeholder request
    this.http.post(`${this.apiURL}/valid-token`, { token: this.cookie.get('token') } ).subscribe((data) => {
      const valid = data as IValidToken;
      console.log(data);
      if (valid.valid) {
        //this.getUserInfo();
      } else {
        //this.logOut();
      }   
    });
  }

  private getUserInfo(): void {
    this.http.get(`${this.apiURL}/user`).subscribe((data) => {
      this.currentUserSubject.next(data as IUser);
    });
  }
}

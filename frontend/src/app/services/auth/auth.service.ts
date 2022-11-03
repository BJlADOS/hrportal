import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
    private _router: Router,
    ) { 
      console.log('auth service');
    }

  public get currentUserValue(): IUser | null { //placeholder
    return { fullname: 'test', email: 'test', contact: 'test', expirience: 1, currentDepartment: { id: 1, name: 'test', managerId: 1 }, photo: 'test', existingSkills: [{ id: 1, name: 'test' }], isManager: true, isAdmin: true, id: 1, filled: true, resumeId: 1 };
  }

  public signUp(fullname: string, email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${ this.apiURL }/reg/`, { fullname: fullname, email: email, password: passwordHash  }).subscribe((data) => {
      console.log(data);
      this._router.navigate(['/vacancies']);
    }, (error) => {
      console.log(error);
    });
  }

  public signIn(email: string, password: string, returnUrl: string | undefined): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${this.apiURL}/login/`, { email: email, password: passwordHash }).subscribe({ next: () => {
      if (returnUrl) {
        this._router.navigate([returnUrl]);
      } else {
        this._router.navigate(['/vacancies']);
      }
    }, error: (error) => {
      console.log(error);
    }});
  }

  public checkEmail(email: string): Observable<Object> {
    return this.http.post(`${this.apiURL}/unique-email/`, { email: email });
  }

  public logOut(): void { 
    this.http.get(`${this.apiURL}/logout`).subscribe( { next: (data) => { 
      this._router.navigate(['/auth']);
    }, error: (error) => {
      console.log(error);
    }});

    // this.currentUserSubject.next(null);
    // this.cookie.remove('token');
  }

  public init(): void {
    //this.validateToken();
  }

  private validateToken(): void { //placeholder request
    this.http.get(`${this.apiURL}/authorized`).subscribe((data) => {
      const valid = data as IValidToken;
      console.log(data);
      if (valid.authorized) {
        this.getUserInfo();
      } else {
        this._router.navigate(['/auth']);
      }   
    });
  }

  private getUserInfo(): void {
    this.http.get(`${this.apiURL}/user`).subscribe((data) => {
      this.currentUserSubject.next(data as IUser);
    });
  }
}

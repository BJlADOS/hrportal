import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SHA256 } from 'crypto-js';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ConfirmEmailModalComponent } from 'src/app/auth/components/confirm-email-modal/confirm-email-modal.component';
import { IToken, IValidToken } from 'src/app/interfaces/Token';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { ModalService } from '../modal/modal.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _apiURL: string = environment.apiURL;

  constructor(
    public http: HttpClient,
    private _router: Router,
    private _user: UserService,
    private _modal: ModalService,
    ) {}

  public signUp(fullname: string, email: string, password: string): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${ this._apiURL }/reg/`, { fullname: fullname, email: email, password: passwordHash  }).subscribe({ next: () => {
      this._router.navigate(['/auth']);
      this._modal.open(ConfirmEmailModalComponent, { email: email });
    }, error: (error) => {
      console.log(error);
    }});
  }

  public signIn(email: string, password: string, returnUrl: string | undefined): void {
    const passwordHash: string = SHA256(password).toString();
    this.http.post(`${this._apiURL}/login/`, { email: email, password: passwordHash }).subscribe({ next: () => {
      if (returnUrl) {
        this._router.navigate([returnUrl]);
      } else {
        this._router.navigate(['/vacancies']);
      }
    }, error: (error) => {
      console.log(error);
    }});
  }

  public requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this._apiURL}/recovery-request/`, { email }) as Observable<any>;
  }

  public resetPassword(password: string, token: string | undefined): Observable<any> {
    const passwordHash: string = SHA256(password).toString();
    return this.http.post(`${this._apiURL}/recovery/`, { password: passwordHash, code: token }) as Observable<any>;
  }

  public checkEmail(email: string): Observable<Object> {
    return this.http.post(`${this._apiURL}/unique-email/`, { email: email });
  }

  public logOut(): void { 
    this.http.get(`${this._apiURL}/logout`).subscribe( { next: (data) => { 
      this._user.logOut();
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
    this.http.get(`${this._apiURL}/authorized`).subscribe((data) => {
      const valid = data as IValidToken;
      console.log(data);
      if (valid.authorized) {
        this._user.getUserInfo();
      } else {
        this._router.navigate(['/auth']);
      }   
    });
  }

}

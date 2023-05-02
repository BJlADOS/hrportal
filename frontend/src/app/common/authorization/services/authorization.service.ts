import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IValidToken } from '../interfaces';
import { UserService } from '../../user';
import { ModalService } from '../../../lib';


@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    private _apiURL: string = environment.apiURL;

    constructor(
        public http: HttpClient,
        private _router: Router,
        private _user: UserService,
        private _modal: ModalService,
    ) {}

    public signUp(fullname: string, email: string, password: string): Observable<any> {
        return this.http.post(`${ this._apiURL }/reg/`, { fullname: fullname, email: email, password: password });
    }

    public signIn(email: string, password: string, returnUrl: string | undefined): Observable<any> {
        return this.http.post(`${this._apiURL}/login/`, { email: email, password: password });
    }

    public requestPasswordReset(email: string): Observable<any> {
        return this.http.post(`${this._apiURL}/change-password/`, { email }) as Observable<any>;
    }

    public resetPassword(password: string, token: string | undefined): Observable<any> {

        return this.http.post(`${this._apiURL}/set-password/`, { password: password, code: token }) as Observable<any>;
    }

    public checkEmail(email: string): Observable<{ unique: boolean }> {
        return this.http.post<{ unique: boolean }>(`${this._apiURL}/unique-email/`, { email: email });
    }

    public logOut(): void {
        this.http.get(`${this._apiURL}/logout`).subscribe( { next: (data) => {
            this._user.logOut();
            this._router.navigate(['account/authorization']);
        }, error: (error) => {
            console.log(error);
        } });

    // this.currentUserSubject.next(null);
    // this.cookie.remove('token');
    }

    public init(): void {
    //this.validateToken();
    }

    private validateToken(): void { //placeholder request
        this.http.get<IValidToken>(`${this._apiURL}/authorized`).subscribe((data: IValidToken) => {
            const valid: IValidToken = data as IValidToken;
            console.log(data);
            if (valid.authenticated) {
                this._user.getUserInfo();
            } else {
                this._router.navigate(['account/authorization']);
            }
        });
    }

}

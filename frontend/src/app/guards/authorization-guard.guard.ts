import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IValidToken } from 'src/app/interfaces/Token';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {
    constructor(
    public http: HttpClient,
    private _router: Router,
    private _user: UserService,
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.http.get(`${environment.apiURL}/authorized`).pipe(map((data) => {
            const token: IValidToken = data as IValidToken;
            if (token.authorized) {
                this._user.getUserInfo();
            } else {
                this._router.navigate(['account/authorization'], { queryParams: { returnUrl: state.url } });
            }

            return token.authorized;
        }));
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IValidToken } from '../interfaces';


@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

    constructor(
        public http: HttpClient,
        private _router: Router,
    ) { }

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.http.get(`${environment.apiURL}/authorized`)
            .pipe(
                map((data: object) => {
                    const token: IValidToken = data as IValidToken;
                    if (token.authorized) {
                        this._router.navigate(['cabinet/vacancies']);
                    }

                    return !token.authorized;
                })
            );
    }

}

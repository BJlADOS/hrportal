import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IUser, UserService } from '../../../common';
import { environment } from '../../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        public http: HttpClient,
        private _router: Router,
        private _user: UserService,
    ) { }

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.http.get(`${environment.apiURL}/user`).pipe(map((data) => {
            const user: IUser = data as IUser;
            if (!user.isAdmin) {
                this._router.navigate(['cabinet/vacancies']);
            }

            return user.isAdmin;
        }));
    }
}


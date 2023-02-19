import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
    constructor(
    public http: HttpClient,
    private _router: Router,
    private _user: UserService,
    ) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.http.get(`${environment.apiURL}/user`)
            .pipe(
                map((data: object) => {
                    const user: IUser = data as IUser;
                    if (!(user.isAdmin || user.isManager)) {
                        this._router.navigate(['cabinet/vacancies']);
                    }

                    return user.isAdmin || user.isManager;
                })
            );
    }
}

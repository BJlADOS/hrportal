import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(
    public http: HttpClient,
    private _router: Router,
    private _user: UserService,
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.http.get(`${environment.apiURL}/user`).pipe(map((data) => {
        const user = data as IUser;
        if (!(user.isAdmin || user.isManager)) {
          this._router.navigate(['vacancies']);
        }
        return user.isAdmin || user.isManager;
      }));
  }
}

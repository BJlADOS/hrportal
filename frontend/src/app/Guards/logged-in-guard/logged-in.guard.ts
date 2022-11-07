import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IValidToken } from 'src/app/interfaces/Token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(
    public http: HttpClient,
    private _router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.http.get(`${environment.apiURL}/authorized`).pipe(map((data) => {
        const token = data as IValidToken;
        if (token.authorized) {
          this._router.navigate(['vacancies']);
          return false;
        } else {
          return true;
        }
      }));
  }
  
}

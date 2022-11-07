import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { map, Observable } from "rxjs";
import { IValidToken } from "src/app/interfaces/Token";
import { AuthService } from "src/app/services/auth/auth.service";
import { UserService } from "src/app/services/user/user.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public http: HttpClient,
    private _router: Router,
    private _user: UserService,
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.http.get(`${environment.apiURL}/authorized`).pipe(map((data) => {
      const token = data as IValidToken;
      if (token.authorized) {
        this._user.getUserInfo()
        return true;
      } else {
        this._router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    }));
    // this._router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    // return false;
  }
}
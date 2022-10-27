import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "src/app/services/auth/auth.service";

export class AuthGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _auth: AuthService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this._auth.currentUserValue;
    if (currentUser) {
      return true;
    }

    this._router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {

  constructor(
    private _auth: AuthService,
    private _cookie: CookieService,
  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const currentUser = this._auth.currentUserValue;
      if (this._cookie.hasKey('token') && currentUser) {
          req = req.clone({
              setHeaders: {
                  Authorization: `Bearer ${this._cookie.get('token')}`
              }
          });
      }

      return next.handle(req);
  }
}

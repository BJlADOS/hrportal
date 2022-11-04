import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/interfaces/User';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: Observable<IUser | null> = this._user.currentUser;

  constructor(
    private _user: UserService,
    private _auth: AuthService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  public redirectTo(to: string, isAllowed: boolean): void {
    if (isAllowed) {
      this._router.navigate([to]);
    }
  }

  public isActive(path: string): boolean {
    return this._router.url === path;
  }

  public getUserName(fullname: string): string {
    const name: string[] = fullname.split(' ');
    return `${name[0]} ${name[1]}`;
  }

  public logout(): void {
    this._auth.logOut();
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    public auth: AuthService,
    public user: UserService,
  ) { }

  public ngOnInit(): void {
    this.auth.init();
    this.user.getUserInfo();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss']
})
export class ConfirmEmailComponent implements OnInit {

  public isLoading: boolean = true;
  public confirmMessage: string | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _user: UserService,
    private _router: Router,
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe(params => {
      this.confirmEmail(params['token']);
    });
  }

  public confirmEmail(token: string): void {
    this._user.confirmEmail(token).subscribe({
      next: () => {
        this.confirmMessage = 'Почта успешно подтверждена';
        this.isLoading = false;
        this.startRedirect();
      }, error: (error) => {
        this.isLoading = false;
        this.startRedirect();
      }
    });
  }

  public startRedirect(): void {
    setTimeout(() => {
      this._router.navigate(['/']);
    }, 5000);
  }

}

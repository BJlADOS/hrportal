import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { IAuthError, IInputError, ISubmitError } from 'src/app/interfaces/errors';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public passwordPlaceholder: string = 'Пароль';
  public emailPlaceholder: string = 'Электронная почта';
  public signInForm: FormGroup = this._formGenerator.getSignInForm();
  public errors: IAuthError = { email: null, password: null };

  private _returnUrl: string | undefined;
  private _FormManager: FormManager = FormManager.getInstance();

  constructor(
    public auth: AuthService,
    public router: Router,
    public activeRoute: ActivatedRoute,
    private _formGenerator: FormGenerator
  ) { }

  public ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      this._returnUrl = params['returnUrl'];
    });
  }

  public signIn(): void {
    this.auth.signIn(this.signInForm.value.email, this.signInForm.value.password, this._returnUrl);
  }

  public forgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }

  public emailChange(): void {
    this.errors.email = this._FormManager.checkEmail(this.signInForm);
  }

  public passwordChange(): void {
    this.errors.password = this._FormManager.checkPassword(this.signInForm);
  }

  public toSignUp(): void { 
    this.router.navigate(['register']);
  }

  public passwordBlur(): void { 
    this.passwordPlaceholder = 'Пароль';
  }

  public passwordFocus(): void {
    this.passwordPlaceholder = 'Используйте 6-20 символов (только A-Z, a-z, 0-9)';
  }

  public emailBlur(): void {
    this.emailPlaceholder = 'Электронная почта';
  }

  public emailFocus(): void {
    this.emailPlaceholder = 'Используйте корпоративную почту';
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { IResetPasswordError } from 'src/app/interfaces/errors';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.component.html',
  styleUrls: ['./recovery-password.component.scss'],
  animations: [contentExpansion],
})
export class RecoveryPasswordComponent implements OnInit {

  public isLoading: boolean = false;
  public passwordPlaceholder: string = 'Пароль';
  public errors: IResetPasswordError = { password: null };
  public successMessage: string | undefined = undefined;
  public errorMessage: string | undefined = undefined;

  public resetPasswordForm = this._form.getRecoveryPasswordForm();

  private _FormManager: FormManager = FormManager.getInstance();
  private _token: string | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthService,
    private _form: FormGenerator,
  ) { }

  public ngOnInit(): void {
    this._activatedRoute.queryParams.subscribe((params: any) => {
      this._token = params['code'];
    });
  }

  public passwordBlur(): void {
    this.passwordPlaceholder = 'Пароль';
  }

  public passwordFocus(): void {
    this.passwordPlaceholder = 'Используйте 6-20 символов (только A-Z, a-z, 0-9)';
  }

  public passwordChange(): void {
    this.errors.password = this._FormManager.checkPassword(this.resetPasswordForm);
  }

  public confirmPasswordChange(): void {
    this.errors.confirmPassword = this._FormManager.checkConfirmPassword(this.resetPasswordForm);
  }

  public resetPassword(): void {
    this.isLoading = true;
    this._auth.resetPassword(this.resetPasswordForm.value.password, this._token)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.errorMessage = undefined;
          this.successMessage = 'Пароль успешно изменен, вы можете закрыть эту страницу';
        }, error: (err: any) => {
          this.isLoading = false;
          this.successMessage = undefined;
          this.errorMessage = 'Произошла ошибка, попробуйте еще раз';
        }
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { FormGenerator } from 'src/app/classes/form-generator/form-generator';
import { FormManager } from 'src/app/classes/form-manager/form-manager';
import { IInputError, IRecoveryRequestError } from 'src/app/interfaces/errors';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recovery-request',
  templateUrl: './recovery-request.component.html',
  styleUrls: ['./recovery-request.component.scss'],
  animations: [contentExpansion],
})
export class RecoveryRequestComponent {

  public recoveryRequestForm = this._form.getRecoveryRequestForm();
  public errors: IRecoveryRequestError = { email: null };

  public emailPlaceholder: string = 'Электронная почта';
  public successMessage: string | undefined = undefined;
  public errorMessage: string | undefined = undefined;
  

  private _FormManager: FormManager = FormManager.getInstance();

  constructor(
    private _auth: AuthService,
    private _form: FormGenerator,
    private _router: Router,
  ) { }

  public emailChange(): void {
    this.errors.email = this._FormManager.checkEmail(this.recoveryRequestForm);
  }

  public emailBlur(): void {
    this.emailPlaceholder = 'Электронная почта';
  }

  public emailFocus(): void {
    this.emailPlaceholder = 'Используйте корпоративную почту';
  }

  public toSignIn(): void {
    this._router.navigate(['auth']);
  }

  public sendRequest(): void {
    this._auth.requestPasswordReset(this.recoveryRequestForm.value.email)
      .subscribe({
        next:
          () => this.successMessage = 'На вашу электронную почту отправлено письмо с инструкциями по восстановлению пароля.',
        error: (error) => this.errorMessage = "Произошла ошибка. Попробуйте еще раз."
      }
      );
  }

}

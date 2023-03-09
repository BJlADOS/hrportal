import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { contentExpansion, FormGenerator, FormManager } from '../../../../lib';
import {AuthorizationService, IRecoveryRequestError} from '../../../../common';

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


    private _formManager: FormManager = FormManager.getInstance();

    constructor(
        private _auth: AuthorizationService,
        private _form: FormGenerator,
        private _router: Router,
    ) { }

    public emailChange(): void {
        this.errors.email = this._formManager.checkEmail(this.recoveryRequestForm);
    }

    public emailBlur(): void {
        this.emailPlaceholder = 'Электронная почта';
    }

    public emailFocus(): void {
        this.emailPlaceholder = 'Используйте корпоративную почту';
    }

    public toSignIn(): void {
        this._router.navigate(['account/authorization']);
    }

    public sendRequest(): void {
        this._auth.requestPasswordReset(this.recoveryRequestForm.value.email)
            .subscribe({
                next: () => {
                    this.successMessage = 'На вашу электронную почту отправлено письмо с инструкциями по восстановлению пароля.';
                    this.errorMessage = undefined;
                },
                error: (error) => {
                    this.successMessage = undefined;
                    this.errorMessage = 'Произошла ошибка. Попробуйте еще раз.';
                }
            });
    }

}

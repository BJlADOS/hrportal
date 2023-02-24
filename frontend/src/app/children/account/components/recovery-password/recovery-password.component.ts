import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthorizationService, IResetPasswordError} from '../../../../common';
import { contentExpansion, FormGenerator, FormManager } from '../../../../lib';

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
    public successMessage?: string;
    public errorMessage?: string;

    public resetPasswordForm = this._form.getRecoveryPasswordForm();

    private _FormManager: FormManager = FormManager.getInstance();
    private _token: string | undefined;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _auth: AuthorizationService,
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
                    this.successMessage = 'Пароль успешно изменен, вы можете закрыть эту страницу';
                },
                error: (err: any) => {
                    this.isLoading = false;
                    this.errorMessage = 'Произошла ошибка, попробуйте еще раз';
                }
            });
    }
}

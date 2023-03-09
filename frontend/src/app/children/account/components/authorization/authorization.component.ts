import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAuthError, ISubmitError, AuthorizationService } from '../../../../common';
import { contentExpansion, FormGenerator, FormManager } from '../../../../lib';

@Component({
    selector: 'app-authorization',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.scss'],
    animations: [contentExpansion],
})
export class AuthorizationComponent implements OnInit {

    public passwordPlaceholder: string = 'Пароль';
    public emailPlaceholder: string = 'Электронная почта';
    public signInForm: FormGroup = this._formGenerator.getSignInForm();
    public errors: IAuthError = { email: null, password: null };
    public submitError: ISubmitError | null = null;

    private _returnUrl: string | undefined;
    private _FormManager: FormManager = FormManager.getInstance();

    constructor(
        public auth: AuthorizationService,
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
        this.auth.signIn(this.signInForm.value.email, this.signInForm.value.password, this._returnUrl)
            .subscribe({
                next: () => {
                    if (this._returnUrl) {
                        this.router.navigate([this._returnUrl]);
                    } else {
                        this.router.navigate(['cabinet/vacancies']);
                    }
                },
                error: (error) => {
                    this.submitError = { message: 'Неверная почта или пароль' };
                }
            });
    }

    public forgotPassword(): void {
        this.router.navigate(['account/forgot-password']);
    }

    public emailChange(): void {
        this.errors.email = this._FormManager.checkEmail(this.signInForm);
    }

    public passwordChange(): void {
        this.errors.password = this._FormManager.checkPassword(this.signInForm);
    }

    public toSignUp(): void {
        this.router.navigate(['account/register']);
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

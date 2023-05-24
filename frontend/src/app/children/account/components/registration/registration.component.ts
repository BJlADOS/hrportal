import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, map, takeUntil } from 'rxjs';
import { ConfirmEmailModalComponent } from '../confirm-email-modal/confirm-email-modal.component';
import { AuthorizationService, IAuthError, ISubmitError } from '../../../../common';
import { contentExpansion, DestroyService, FormGenerator, FormManager, ModalService } from '../../../../lib';
import { PageBase } from '../../../../lib/shared/components/page-base/page-base.component';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    animations: [contentExpansion],
    providers: [DestroyService],
})
export class RegistrationComponent extends PageBase implements OnInit {

    public signUpForm: FormGroup = this.formGenerator.getSignUpForm();
    public passwordPlaceholder: string = 'Пароль';
    public emailPlaceholder: string = 'Электронная почта';
    public errors: IAuthError = { fullname: null, email: null, password: null, confirmPassword: null };
    public submitError: ISubmitError | null = null;

    private _formManager: FormManager = FormManager.getInstance();

    constructor(
    public auth: AuthorizationService,
    public router: Router,
    public formGenerator: FormGenerator,
    private _destroy$: DestroyService,
    private _modal: ModalService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.signUpForm.controls['email'].statusChanges
            .pipe(
                takeUntil(this._destroy$),
                map((data) => data === 'INVALID')
            )
            .subscribe(() => {
                this.errors.email = this._formManager.checkEmail(this.signUpForm);
            });
    }

    public signUp(): void { //not implemented
        this.startLoading();
        this.auth.checkEmail(this.signUpForm.value.email)
            .pipe(
                takeUntil(this._destroy$)
            )
            .subscribe({
                next: (data: { unique: boolean }) => {
                    const isEmailUnique: boolean = (data as { unique: boolean }).unique;
                    if (isEmailUnique) {
                        this.auth.signUp(this.signUpForm.value.fullname, this.signUpForm.value.email, this.signUpForm.value.password)
                            .pipe(
                                takeUntil(this._destroy$),
                                finalize(() => this.stopLoading())
                            )
                            .subscribe({
                                next: () => {
                                    this.router.navigate(['account/authorization']);
                                    this._modal.open(ConfirmEmailModalComponent, { email: this.signUpForm.value.email });
                                },
                                error: () => {
                                    this.submitError = { message: 'Ошибка сервера' };
                                }
                            });
                    } else {
                        this.errors.email = { message: 'Пользователь с такой почтой уже существует' };
                    }
                },
                error: () => {
                    this.submitError = { message: 'Ошибка сервера' };
                }
            });

    }

    public fullnameChange(): void {
        this.errors.fullname = this._formManager.checkFullname(this.signUpForm);
    }

    public emailChange(): void {
        this.errors.email = this._formManager.checkEmail(this.signUpForm);
    }

    public passwordChange(): void {
        this.errors.password = this._formManager.checkPassword(this.signUpForm);
    }

    public confirmPasswordChange(): void {
        this.errors.confirmPassword = this._formManager.checkConfirmPassword(this.signUpForm);
    }

    public toSignIn(): void {
        this.router.navigate(['account/authorization']);
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

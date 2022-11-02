import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IInputError } from 'src/app/interfaces/errors';

export class FormManager {
    private static _formManager: FormManager;

    public static getInstance(): FormManager {
        if (FormManager._formManager) {
            return FormManager._formManager;
        }
        FormManager._formManager = new FormManager();

        return FormManager._formManager;
    }


    public checkErrorsForSignInForm(form: FormGroup): IInputError[] {
        const errors: IInputError[] = [];

        if (form.controls['email'].hasError('required')) {
            errors.push({
                message: 'Введите почту'
            });
        }

        if (form.controls['email'].hasError('email')) {
            errors.push({
                message: 'Введите корректную почту'
            });
        }

        if (form.controls['password'].hasError('required')) {
            errors.push({
                message: 'Введите пароль'
            });
        }

        return errors;
    }

    public checkErrorsForSignUpForm(form: FormGroup): IInputError[] {
        const errors: IInputError[] = [];

        if (form.controls['fullname'].hasError('required')) {
            errors.push({
                message: 'Введите ФИО'
            });
        }

        if (form.controls['fullname'].hasError('minlength')) {
            errors.push({
                message: 'ФИО должно быть не менее 3 символов'
            });
        }

        if (form.controls['fullname'].hasError('shouldBeOnlyRussian')) {
            errors.push({
                message: 'ФИО должно состоять только из русских букв'
            });
        }

        if (form.controls['email'].hasError('required')) {
            errors.push({
                message: 'Введите почту'
            });
        }

        if (form.controls['email'].hasError('email')) {
            errors.push({
                message: 'Введите корректную почту'
            });
        }

        if (form.controls['password'].hasError('required')) {
            errors.push({
                message: 'Введите пароль'
            });
        }

        if (form.controls['password'].hasError('minlength')) {
            errors.push({
                message: 'Пароль должен быть не менее 6 символов'
            });
        }

        if (form.controls['password'].hasError('maxlength')) {
            errors.push({
                message: 'Пароль должен быть не более 20 символов'
            });
        }

        if (form.controls['password'].hasError('pattern')) {
            errors.push({
                message: 'Пароль должен содержать только латинские буквы и цифры'
            });
        }

        if (form.controls['confirmPassword'].hasError('required')) {
            errors.push({
                message: 'Подтвердите пароль'
            });
        }

        if (form.controls['confirmPassword'].hasError('NoPassswordMatch')) {
            errors.push({
                message: 'Пароли не совпадают'
            });
        }

        return errors;
    }
}

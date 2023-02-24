import { FormGroup } from '@angular/forms';
import { IInputError } from '../../common';

export class FormManager {
    private static _formManager: FormManager;

    public static getInstance(): FormManager {
        if (FormManager._formManager) {
            return FormManager._formManager;
        }
        FormManager._formManager = new FormManager();

        return FormManager._formManager;
    }

    public checkEmail(form: FormGroup): IInputError | null {
        if (form.controls['email'].hasError('required')) {
            return { message: 'Введите email.' };
        }

        if (form.controls['email'].hasError('email')) {
            return { message: 'Введите корректную почту.' };
        }

        return null;
    }

    public checkPassword(form: FormGroup): IInputError | null {

        if (form.controls['password'].hasError('required')) {
            return { message: 'Введите пароль.' };
        }

        if (form.controls['password'].hasError('pattern')) {
            return { message: 'Пароль должен состоять из латинских букв и цифр.' };
        }

        if (form.controls['password'].hasError('minlength')) {
            return { message: 'Пароль должен быть не менее 6 символов.' };
        }

        if (form.controls['password'].hasError('maxlength')) {
            return { message: 'Пароль должен быть не более 20 символов.' };
        }

        return null;
    }

    public checkFullname(form: FormGroup): IInputError | null {

        if (form.controls['fullname'].hasError('required')) {
            return { message: 'Введите ФИО.' };
        }

        if (form.controls['fullname'].hasError('minlength')) {
            return { message: 'ФИО должно быть не менее 3 символов.' };
        }

        if (form.controls['fullname'].hasError('shouldBeCorrect')) {
            return { message: 'ФИО должно быть в формате Фамилия Имя Отчество.' };
        }

        return null;
    }

    public checkConfirmPassword(form: FormGroup): IInputError | null {

        if (form.controls['confirmPassword'].hasError('required')) {
            return { message: 'Подтвердите пароль.' };
        }

        if (form.controls['confirmPassword'].hasError('NoPassswordMatch')) {
            return { message: 'Пароли не совпадают.' };
        }

        return null;
    }

    public checkContact(form: FormGroup): IInputError | null {
        if (form.controls['contact'].hasError('required')) {
            return { message: 'Введите контакт для связи' };
        }

        return null;
    }

    public checkDepartment(form: FormGroup): IInputError | null {
        if (form.controls['department'].hasError('required')) {
            return { message: 'Выберите департамент' };
        }

        return null;
    }

    public checkExperience(form: FormGroup): IInputError | null {
        if (form.controls['experience'].hasError('required')) {
            return { message: 'Выберите опыт работы' };
        }

        return null;
    }

    public checkPosition(form: FormGroup): IInputError | null {
        if (form.controls['position'].hasError('required')) {
            return { message: 'Введите название должности' };
        }

        return null;
    }

    public checkSalary(form: FormGroup): IInputError | null {
        if (form.controls['salary'].hasError('required')) {
            return { message: 'Введите желаемую зарплату' };
        }

        return null;
    }

    public checkSchedule(form: FormGroup): IInputError | null {
        if (form.controls['schedule'].hasError('required')) {
            return { message: 'Выберите график работы' };
        }

        return null;
    }

    public checkEmployment(form: FormGroup): IInputError | null {
        if (form.controls['employment'].hasError('required')) {
            return { message: 'Выберите тип занятости' };
        }

        return null;
    }

    public checkDepartmentName(form: FormGroup): IInputError | null {
        if (form.controls['departmentName'].hasError('required')) {
            return { message: 'Введите название департамента' };
        }

        return null;
    }

}

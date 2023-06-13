import { Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthorizationService } from '../../common';

@Injectable({
    providedIn: 'root'
})
export class CustomValidators {

    constructor(
        private _auth: AuthorizationService,
    ) {}

    public patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (!control.value) {
                return null;
            }
            const valid: boolean = regex.test(control.value);

            return valid ? null : error;
        };
    }

    public passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password: string = control.get('password')!.value;
        const confirmPassword: string = control.get('confirmPassword')!.value;
        if (password !== confirmPassword && confirmPassword.length !== 0) {
            control.get('confirmPassword')!.setErrors({ NoPassswordMatch: true });

            return { NoPassswordMatch: true };
        }

        return null;
    }

    public dateValidator(): ValidatorFn {
        return (control: AbstractControl): { [key:string]: boolean } | null => {
            if(new Date(control.value).getTime() < Date.now()) {
                return { dateNotValid: true };
            }

            return null;
        };
    }
}

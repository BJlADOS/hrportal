import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { ValidationErrors, ValidatorFn, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CustomValidators {

    constructor(
        private _auth: AuthService,
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

    // public emailUniqueValidator(): AsyncValidatorFn {
    //     return (control: AbstractControl): Observable<ValidationErrors | null> => {
    //         const email: string = control!.value;
    //         return this._auth.checkEmail(email).pipe(map((data) => {
    //             const unique = data as { unique: boolean };
    //             return unique.unique ? null : { unique: true };
    //         }));
    //     }
    // }
}

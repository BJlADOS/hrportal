import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
    public static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (!control.value) {
                return null;
            }     
            const valid: boolean = regex.test(control.value);

            return valid ? null : error;
        };
    }
    public static passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
        const password: string = control.get('password')!.value; 
        const confirmPassword: string = control.get('confirmPassword')!.value; 
        if (password !== confirmPassword) {
            control.get('confirmPassword')!.setErrors({ NoPassswordMatch: true });
            
            return { NoPassswordMatch: true };
        }
        
        return null;
    }
}

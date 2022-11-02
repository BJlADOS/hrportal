import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators/custom-validators';

export class FormGenerator {
    private static _formGenerator: FormGenerator;

    public static getInstance(): FormGenerator {
        if (FormGenerator._formGenerator) {
            return FormGenerator._formGenerator;
        }
        FormGenerator._formGenerator = new FormGenerator();

        return FormGenerator._formGenerator;
    }

    private _fb: FormBuilder;

    private constructor() { 
        this._fb = new FormBuilder();
    }

    public getSignUpForm(): FormGroup {
        return this._fb.group(        
            {   
                fullname: [null, Validators.compose([ 
                    Validators.required,
                    Validators.minLength(3),
                    CustomValidators.patternValidator(/^([а-яА-Яё]+)$/, { shouldBeOnlyRussian: true }),
                ])],
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: [null, Validators.compose([
                    Validators.required,
                    CustomValidators.patternValidator(/[A-Z]|[a-z]|\d/, { pattern: true }),
                    Validators.minLength(8)
                ])],
                confirmPassword: [null, Validators.compose([Validators.required])]
            }, 
            {
                validators: CustomValidators.passwordMatchValidator
            }
        );
    }

    public getSignInForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: [null, Validators.compose([
                    Validators.required
                ])],
            }
        );
    }

    public getForgotPasswordForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
            }
        );
    }

    public getEmptyEmailForm(): FormGroup {
        return this._fb.group(        
            {   
                email: [null, Validators.compose([ 
                    Validators.required,
                    Validators.email,
                ])]
            } 
        );
    }

}

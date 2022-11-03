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
                fullname: ['', Validators.compose([ 
                    Validators.required,
                    Validators.minLength(3),
                    CustomValidators.patternValidator(/^([А-Я][а-я]{1,}|[А-Я][а-я]{1,}-([А-Я][а-я]{1,}))(\040[А-Я][а-я]{1,})(\040[А-Я][а-я]{1,})?$/, { shouldBeCorrect: true }),
                ])],
                email: ['', Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: ['', Validators.compose([
                    Validators.required,
                    CustomValidators.patternValidator(/^([A-Za-z\d]+)$/, { pattern: true }),
                    Validators.minLength(6),
                    Validators.maxLength(20),
                ])],
                confirmPassword: ['', Validators.compose([
                    Validators.required,
                ])]
            }, 
            {
                validators: CustomValidators.passwordMatchValidator
            }
        );
    }

    public getSignInForm(): FormGroup {
        return this._fb.group(        
            {   
                email: ['', Validators.compose([
                    Validators.email, 
                    Validators.required,
                ])],
                password: ['', Validators.compose([
                    Validators.required
                ])],
            }
        );
    }

}

import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators/custom-validators';

@Injectable({
    providedIn: 'root'
  })
export class FormGenerator {

    private _fb: FormBuilder = new FormBuilder();

    constructor(
        private _customValidators: CustomValidators,
    ) { }

    public getSignUpForm(): FormGroup {
        return this._fb.group(        
            {   
                fullname: ['', Validators.compose([ 
                    Validators.required,
                    Validators.minLength(3),
                    this._customValidators.patternValidator(/^([А-Я][а-я]{1,}|[А-Я][а-я]{1,}-([А-Я][а-я]{1,}))(\040[А-Я][а-я]{1,})(\040[А-Я][а-я]{1,})?$/, { shouldBeCorrect: true }),
                ])],
                email: new FormControl('', Validators.compose([
                    Validators.required,
                    this._customValidators.patternValidator(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { email: true }),
                ])),
                password: ['', Validators.compose([
                    Validators.required,
                    this._customValidators.patternValidator(/^([A-Za-z\d]+)$/, { pattern: true }),
                    Validators.minLength(6),
                    Validators.maxLength(20),
                ])],
                confirmPassword: ['', Validators.compose([
                    Validators.required,
                ])]
            }, 
            {
                validators: this._customValidators.passwordMatchValidator
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

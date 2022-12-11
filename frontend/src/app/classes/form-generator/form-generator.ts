import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IResume } from 'src/app/interfaces/resume';
import { ISelectOption } from 'src/app/interfaces/select';
import { IDepartment, IUser } from 'src/app/interfaces/User';
import { IVacancy } from 'src/app/interfaces/vacancy';
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

    public getUploadResumeForm(): FormGroup {
        return this._fb.group(
            {
                file: [null, Validators.compose([
                    Validators.required,
                ])],
            }
        );
    }

    public getUserDataForm(user: IUser, experience: ISelectOption[]): FormGroup {
        return this._fb.group(
            {
                fullname: [user.fullname, Validators.compose([
                    Validators.required,
                    Validators.minLength(3),
                    this._customValidators.patternValidator(/^([А-Я][а-я]{1,}|[А-Я][а-я]{1,}-([А-Я][а-я]{1,}))(\040[А-Я][а-я]{1,})(\040[А-Я][а-я]{1,})?$/, { shouldBeCorrect: true }),
                ])],
                email: new FormControl(user.email, Validators.compose([
                    Validators.required,
                    this._customValidators.patternValidator(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { email: true }),
                ])),
                contact: new FormControl(user.contact, Validators.compose([
                    Validators.required,
                ])),
                experience: new FormControl(experience.find((item: ISelectOption) => user.experience === item.id), Validators.compose([
                    Validators.required,
                ])),
                department: new FormControl(user.currentDepartment, Validators.compose([
                    Validators.required,
                ])),
                skills: new FormControl(user.existingSkills.slice()),
            }
        );
    }

    public getResumeForm(resume: IResume | null): FormGroup {
        return this._fb.group(
            {
                position: new FormControl(resume ? resume.desiredPosition : '', Validators.compose([
                    Validators.required,
                ])),
                salary: new FormControl(resume ? resume.desiredSalary : '', Validators.compose([
                    Validators.required,
                ])),
                employment: new FormControl(resume ? resume.desiredEmployment : '', Validators.compose([
                    Validators.required,
                ])),
                schedule: new FormControl(resume ? resume.desiredSchedule : '', Validators.compose([
                    Validators.required,
                ])),
                isActive: new FormControl(resume ? resume.isActive : true),
            }
        );
    }

    public getVacancyForm(vacancy: IVacancy | null): FormGroup {
        return this._fb.group(
            {
                position: new FormControl(vacancy ? vacancy.position : null, Validators.compose([
                    Validators.required,
                ])),
                department: new FormControl(vacancy ? vacancy.department : null, Validators.compose([
                    Validators.required,
                ])),
                salary: new FormControl(vacancy ? vacancy.salary : null, Validators.compose([
                    Validators.required,
                ])),
                employment: new FormControl(vacancy ? vacancy.employment : null, Validators.compose([
                    Validators.required,
                ])),
                schedule: new FormControl(vacancy ? vacancy.schedule : null, Validators.compose([
                    Validators.required,
                ])),
                description: new FormControl(vacancy ? vacancy.description : null, Validators.compose([
                    Validators.required,
                ])),
                requiredSkills: new FormControl(vacancy ? vacancy.requiredSkills.slice() : null, Validators.compose([
                    Validators.required,
                ])),
            }
        )
    }

    public getDepartmentForm(department: IDepartment | null): FormGroup {
        return this._fb.group(
            {
                departmentName: new FormControl(department ? department.name : null, Validators.compose([
                    Validators.required,
                ])),
                managerId: new FormControl(department ? department.managerId : true, Validators.compose([
                    Validators.required,
                ])),
            }
        )
    }
}

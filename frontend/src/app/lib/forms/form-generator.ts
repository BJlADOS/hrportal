import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from './custom-validators';
import {IDepartment, IFilter, IResume, IUser, IVacancy} from '../../common';
import {ISelectOption} from './controls';
import {Ordering} from '../utils';
import {IResumeRequest} from "../../common/resume/interfaces/resume-request.interface";
import {Status} from "../utils/enums/status.enum";

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
                contact: new FormControl(user.contact),
                experience: new FormControl(experience.find((item: ISelectOption) => user.experience === item.id), Validators.compose([
                    Validators.required,
                ])),
                department: new FormControl(user.currentDepartment, Validators.compose([
                    user.isAdmin || user.isManager? null : Validators.required,
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
                position: new FormControl(vacancy ? vacancy.position : '', Validators.compose([
                    Validators.required,
                ])),
                salary: new FormControl(vacancy ? vacancy.salary : '', Validators.compose([
                    Validators.required,
                ])),
                employment: new FormControl(vacancy ? vacancy.employment : null, Validators.compose([
                    Validators.required,
                ])),
                schedule: new FormControl(vacancy ? vacancy.schedule : null, Validators.compose([
                    Validators.required,
                ])),
                description: new FormControl(vacancy ? vacancy.description : ''),
                requiredSkills: new FormControl(vacancy ? vacancy.requiredSkills.slice() : []),
            }
        );
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
        );
    }

    public getRecoveryRequestForm(): FormGroup {
        return this._fb.group(
            {
                email: new FormControl(null, Validators.compose([
                    Validators.required,
                    this._customValidators.patternValidator(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { email: true }),
                ])),
            }
        );
    }

    public getRecoveryPasswordForm(): FormGroup {
        return this._fb.group(
            {
                password: new FormControl('', Validators.compose([
                    Validators.required,
                    this._customValidators.patternValidator(/^([A-Za-z\d]+)$/, { pattern: true }),
                    Validators.minLength(6),
                    Validators.maxLength(20),
                ])),
                confirmPassword: new FormControl('', Validators.compose([
                    Validators.required,
                ])),
            },
            {
                validators: this._customValidators.passwordMatchValidator
            }
        );
    }

    public getFilterForm(filters?: IFilter): FormGroup {
        return this._fb.group(
            {
                salary_min: new FormControl(filters?.salary_min?? ''),
                salary_max: new FormControl(filters?.salary_max?? ''),
                departments: new FormControl(filters?.departments?? []),
                employment: new FormControl(filters?.employment?? []),
                schedule: new FormControl(filters?.schedule?? []),
                skills: new FormControl(filters?.skills?? []),
            }
        );
    }

    public getResumesFiltersForm(filters?: IResumeRequest): FormGroup {
        return this._fb.group(
            {
                employment: new FormControl(filters?.employment?? []),
                schedule: new FormControl(filters?.schedule?? []),
                skills: new FormControl(filters?.skills?? []),
                salary_min: new FormControl(filters?.salary_min?? ''),
                salary_max: new FormControl(filters?.salary_max?? ''),
            }
        );
    }

    public getSeachForm(search?: string): FormGroup {
        return this._fb.group(
            {
                search: new FormControl(search?? ''),
            }
        );
    }

    public getOrderingForm(ordering?: Ordering): FormGroup {
        return this._fb.group(
            {
                ordering: new FormControl(ordering?? Ordering['-time']),
            }
        );
    }
}

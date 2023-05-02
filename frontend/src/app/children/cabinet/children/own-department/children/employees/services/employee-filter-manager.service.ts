import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { SkillsService } from '../../../../../../../common';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployeeFilterViewModel } from '../view-models/employee-filter.view-model';

@Injectable()
export class EmployeeFilterManagerService {
    constructor(
        private _skillsService: SkillsService,
        private _formBuilder: FormBuilder,
    ) { }

    public fillViewModel(viewModel: EmployeeFilterViewModel): Observable<EmployeeFilterViewModel> {
        return this.getForm()
            .pipe(
                map((form: FormGroup) => {
                    viewModel.form = form;

                    return viewModel;
                })
            );
    }

    public getForm(): Observable<FormGroup> {
        return of(this._formBuilder.group(
            {
                experience: new FormControl(),
                skills: new FormControl(),
            }
        ));
    }
}

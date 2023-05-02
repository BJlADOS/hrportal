import { Component, Inject } from '@angular/core';
import { USER_DEPARTMENT_PROVIDER } from '../../providers/user-department.provider';
import { USER_DEPARTMENT_TOKEN } from '../../tokens/user-department.token';
import { Subject } from 'rxjs';
import { IDepartment } from '../../../../../../common';

@Component({
    template: `
        <div class="wrapper">
            <div class="wrapper-grid">
                <div class="wrapper-flex column-1-13">
                    <div class="department-page">
                        <div class="department-page__department-title" *ngIf="department$ | async as department">
                            {{department?.name}}
                        </div>
                        <div class="department-page__department-list">
                            <router-outlet></router-outlet>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['own-department-layout.scss'],
    providers: [
        USER_DEPARTMENT_PROVIDER
    ]
})
export class OwnDepartmentLayoutComponent {

    constructor(@Inject(USER_DEPARTMENT_TOKEN) protected department$: Subject<IDepartment>) { }
}

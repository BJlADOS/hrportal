import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import {
    IDepartment,
    IUser,
    UserService
} from '../../../../../../common';
import { contentExpansionHorizontal } from '../../../../../../lib';
import { USER_DEPARTMENT_TOKEN } from '../../../own-department/tokens/user-department.token';


@Component({
    selector: 'vacancy-list',
    templateUrl: './vacancy-list.component.html',
    styleUrls: ['./vacancy-list.component.scss'],
    animations: [contentExpansionHorizontal],
})
export class VacancyListMainComponent {

    public user: Observable<IUser | null> = this._user.currentUser$;

    constructor(
        private _user: UserService,
    ) { }
}

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
    IUser,
    UserService
} from '../../../../../../common';
import { contentExpansionHorizontal } from '../../../../../../lib';


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

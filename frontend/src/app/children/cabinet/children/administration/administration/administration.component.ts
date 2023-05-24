import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-administration',
    templateUrl: './administration.component.html',
    styleUrls: ['./administration.component.scss'],
})
export class AdministrationComponent {

    constructor(
        private _router: Router,
    ) { }

    public isActive(path: string): boolean {
        return this._router.url === `/cabinet/administration/lists/${path}`;
    }

}

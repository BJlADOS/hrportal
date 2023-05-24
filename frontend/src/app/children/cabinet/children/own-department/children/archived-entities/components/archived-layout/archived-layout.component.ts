import { Component } from '@angular/core';
import { contentExpansionHorizontal, DestroyService } from '../../../../../../../../lib';
import { Router } from '@angular/router';

@Component({
    selector: 'app-archived-layout',
    templateUrl: './archived-layout.component.html',
    styleUrls: ['./archived-layout.component.scss'],
    providers: [DestroyService],
    animations: [contentExpansionHorizontal],
})
export class ArchivedLayoutComponent {
    constructor(
        private _router: Router,
    ) { }

    public isActive(path: string): boolean {
        return this._router.url === `/cabinet/own-department/archived/lists/${path}`;
    }
}

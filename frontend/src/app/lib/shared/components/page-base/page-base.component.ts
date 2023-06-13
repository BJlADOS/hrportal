/* eslint-disable @angular-eslint/component-class-suffix */
import { Directive, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Directive()
export abstract class PageBase {
    @Output()
    public get loading$(): Observable<any> {
        return this._loading$.asObservable();
    }

    public isLoading: boolean = false;
    private _loading$: Subject<boolean> = new Subject<boolean>();

    protected stopLoading(): void {
        this.isLoading = false;
        this._loading$.next(false);
    }

    protected startLoading(): void {
        this.isLoading = true;
        this._loading$.next(true);
    }

}

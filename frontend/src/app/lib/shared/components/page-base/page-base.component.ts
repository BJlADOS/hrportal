/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';

@Component({
    selector: 'page-base',
    template: '',
})
export abstract class PageBase {
    public isLoading: boolean = false;

    protected stopLoading(): void {
        this.isLoading = false;
    }

    protected startLoading(): void {
        this.isLoading = true;
    }

}

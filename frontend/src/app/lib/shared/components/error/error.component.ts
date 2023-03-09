import { Component, Input } from '@angular/core';
import { IInputError } from '../../../../common';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
    @Input()
    public error!: IInputError | null;
}

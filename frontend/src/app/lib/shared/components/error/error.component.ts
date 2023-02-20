import { Component, Input } from '@angular/core';
import { IInputError } from 'src/app/interfaces/errors';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  @Input() public error!: IInputError | null;
}

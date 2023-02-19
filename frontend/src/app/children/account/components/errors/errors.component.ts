import { Component, Input } from '@angular/core';
import { IAuthError } from 'src/app/interfaces/errors';
import { contentExpansion } from '../../../../lib';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class ErrorsComponent {

  @Input() public errors!: IAuthError;
}

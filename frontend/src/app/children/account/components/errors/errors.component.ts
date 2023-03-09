import { Component, Input } from '@angular/core';
import { contentExpansion } from '../../../../lib';
import { IAuthError } from '../../../../common';

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

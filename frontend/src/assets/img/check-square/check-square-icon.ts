import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'check-square-icon',
    templateUrl: 'check-square-icon.svg',
    styleUrls: ['check-square-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckSquareIconComponent extends SVGIconComponent {

}
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'minus-icon',
    templateUrl: 'minus-icon.svg',
    styleUrls: ['minus-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinusIconComponent extends SVGIconComponent {

}

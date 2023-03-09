import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'plus-icon',
    templateUrl: 'plus-icon.svg',
    styleUrls: ['plus-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlusIconComponent extends SVGIconComponent {

}
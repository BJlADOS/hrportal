import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'cross1-icon',
    templateUrl: 'cross1-icon.svg',
    styleUrls: ['cross1-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cross1IconComponent extends SVGIconComponent {

}
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'cross-icon',
    templateUrl: 'cross-icon.svg',
    styleUrls: ['cross-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CrossIconComponent extends SVGIconComponent {

}
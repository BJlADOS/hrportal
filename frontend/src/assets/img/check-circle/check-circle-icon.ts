import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'check-circle-icon',
    templateUrl: 'check-circle-icon.svg',
    styleUrls: ['check-circle-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckCircleIconComponent extends SVGIconComponent {

}
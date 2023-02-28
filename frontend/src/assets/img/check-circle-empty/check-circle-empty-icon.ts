import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'check-circle-empty-icon',
    templateUrl: 'check-circle-empty-icon.svg',
    styleUrls: ['check-circle-empty-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckCircleEmptyIconComponent extends SVGIconComponent {

}
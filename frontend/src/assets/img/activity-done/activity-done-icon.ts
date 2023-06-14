import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'activity-done-icon',
    templateUrl: 'activity-done-icon.svg',
    styleUrls: ['activity-done-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDoneIconComponent extends SVGIconComponent {

}

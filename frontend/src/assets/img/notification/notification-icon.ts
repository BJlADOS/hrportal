import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'notification-icon',
    templateUrl: 'notification-icon.svg',
    styleUrls: ['notification-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationIconComponent extends SVGIconComponent {

}

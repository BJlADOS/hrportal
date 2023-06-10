import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'delete-activity-icon',
    templateUrl: 'delete-activity-icon.svg',
    styleUrls: ['delete-activity-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteActivityIconComponent extends SVGIconComponent {

}

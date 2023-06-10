import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'edit-activity-icon',
    templateUrl: 'edit-activity-icon.svg',
    styleUrls: ['edit-activity-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditActivityIconComponent extends SVGIconComponent {

}

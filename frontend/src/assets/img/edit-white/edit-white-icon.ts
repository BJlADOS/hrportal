import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'edit-white-icon',
    templateUrl: 'edit-white-icon.svg',
    styleUrls: ['edit-white-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditWhiteIconComponent extends SVGIconComponent {

}
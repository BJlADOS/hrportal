import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'edit-icon',
    templateUrl: 'edit-icon.svg',
    styleUrls: ['edit-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditIconComponent extends SVGIconComponent {

}
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'pencil-icon',
    templateUrl: 'pencil-icon.svg',
    styleUrls: ['pencil-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PencilIconComponent extends SVGIconComponent {

}
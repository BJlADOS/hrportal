import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'empty-circle-icon',
    templateUrl: 'empty-circle-icon.svg',
    styleUrls: ['empty-circle-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyCircleIconComponent extends SVGIconComponent {

}

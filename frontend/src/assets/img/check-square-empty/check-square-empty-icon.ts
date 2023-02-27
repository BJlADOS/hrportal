import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'check-square-empty-icon',
    templateUrl: 'check-square-empty-icon.svg',
    styleUrls: ['check-square-empty-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckSquareEmptyComponent extends SVGIconComponent {

}
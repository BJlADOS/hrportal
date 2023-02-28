import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'union-icon',
    templateUrl: 'union-icon.svg',
    styleUrls: ['union-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnionIconComponent extends SVGIconComponent {

}
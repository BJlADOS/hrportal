import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'cross2-icon',
    templateUrl: 'cross2-icon.svg',
    styleUrls: ['cross2-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cross2IconComponent extends SVGIconComponent {

}
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'magnifier-icon',
    templateUrl: 'magnifier-icon.svg',
    styleUrls: ['magnifier-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MagnifierIconComponent extends SVGIconComponent {

}
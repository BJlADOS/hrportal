import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'up-arrow-icon',
    templateUrl: 'up-arrow-icon.svg',
    styleUrls: ['up-arrow-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpArrowIconComponent extends SVGIconComponent {

}
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'archive1-icon',
    templateUrl: 'archive1-icon.svg',
    styleUrls: ['archive1-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Archive1IconComponent extends SVGIconComponent {

}
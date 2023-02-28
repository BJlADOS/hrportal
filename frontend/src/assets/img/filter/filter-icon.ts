import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'filter-icon',
    templateUrl: 'filter-icon.svg',
    styleUrls: ['filter-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterIconComponent extends SVGIconComponent {

}
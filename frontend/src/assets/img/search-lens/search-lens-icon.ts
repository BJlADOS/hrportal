import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'search-lens-icon',
    templateUrl: 'search-lens-icon.svg',
    styleUrls: ['search-lens-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLensIconComponent extends SVGIconComponent {

}

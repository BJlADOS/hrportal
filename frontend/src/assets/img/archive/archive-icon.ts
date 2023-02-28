import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'archive-icon',
    templateUrl: 'archive-icon.svg',
    styleUrls: ['archive-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArchiveIconComponent extends SVGIconComponent {

}
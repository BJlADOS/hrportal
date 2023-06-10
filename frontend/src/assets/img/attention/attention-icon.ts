import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'attention-icon',
    templateUrl: 'attention-icon.svg',
    styleUrls: ['attention-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttentionIconComponent extends SVGIconComponent {

}

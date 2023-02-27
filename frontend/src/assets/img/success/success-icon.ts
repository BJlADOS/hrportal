import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'success-icon',
    templateUrl: 'success-icon.svg',
    styleUrls: ['success-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessIconComponent extends SVGIconComponent {

}
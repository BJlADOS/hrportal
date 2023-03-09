import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'check-static-icon',
    templateUrl: 'check-static-icon.svg',
    styleUrls: ['check-static-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckStaticIconComponent extends SVGIconComponent {

}
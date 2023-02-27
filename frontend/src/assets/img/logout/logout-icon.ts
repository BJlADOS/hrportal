import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'logout-icon',
    templateUrl: 'logout-icon.svg',
    styleUrls: ['logout-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutIconComponent extends SVGIconComponent {

}
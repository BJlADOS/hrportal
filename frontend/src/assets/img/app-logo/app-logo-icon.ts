import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'app-logo-icon',
    templateUrl: 'app-logo-icon.svg',
    styleUrls: ['app-logo-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppLogoIconComponent extends SVGIconComponent {

}
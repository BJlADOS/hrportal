import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'settings-icon',
    templateUrl: 'settings-icon.svg',
    styleUrls: ['settings-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsIconComponent extends SVGIconComponent {

}
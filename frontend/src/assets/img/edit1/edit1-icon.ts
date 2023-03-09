import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'edit1-icon',
    templateUrl: 'edit1-icon.svg',
    styleUrls: ['edit1-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Edit1IconComponent extends SVGIconComponent {

}
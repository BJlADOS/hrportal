import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'letter-icon',
    templateUrl: 'letter-icon.svg',
    styleUrls: ['letter-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LetterIconComponent extends SVGIconComponent {

}
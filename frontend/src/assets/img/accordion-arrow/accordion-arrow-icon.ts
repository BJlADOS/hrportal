import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconComponent } from '../svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'accordion-arrow-icon',
    templateUrl: 'accordion-arrow-icon.svg',
    styleUrls: ['accordion-arrow-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionArrowIconComponent extends SVGIconComponent {

}
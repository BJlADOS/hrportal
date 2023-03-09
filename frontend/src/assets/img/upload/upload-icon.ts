import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DestroyService } from 'src/app/lib';
import { SVGIconDragAndHoverComponent } from '../svg-icon-drag.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'upload-icon',
    templateUrl: 'upload-icon.svg',
    styleUrls: ['upload-icon.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadIconComponent extends SVGIconDragAndHoverComponent {

}
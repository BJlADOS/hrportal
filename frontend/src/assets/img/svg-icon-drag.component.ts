import { ChangeDetectionStrategy, Component, HostBinding, OnInit, Optional } from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroyService, DragAndDropDirective } from 'src/app/lib';
import { HoverListenerDirective } from 'src/app/lib/shared/directives/hover-listener.directive';
import { SVGIconComponent } from './svg-icon.component';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'base-icon',
    template: '',
    styles: [''],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class SVGIconDragAndHoverComponent extends SVGIconComponent implements OnInit {
    @HostBinding('class.drag') private _isDrag: boolean = false;

    constructor(
        private _destroy$: DestroyService,
        private _drag: DragAndDropDirective,
        @Optional() private _hover: HoverListenerDirective,
    ) {
        super(_destroy$, _hover);
    }
    public ngOnInit(): void {
        this._drag.dragState$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (isDrag: boolean) => {
                    this._isDrag = isDrag;
                }
            });
    }
}
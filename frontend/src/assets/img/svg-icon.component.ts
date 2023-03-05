import { AfterViewInit, ChangeDetectionStrategy, Component, HostBinding, Input, OnChanges, Optional } from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/lib';
import { HoverListenerDirective } from 'src/app/lib/shared/directives/hover-listener.directive';

@Component({
    standalone: true,
    providers: [DestroyService],
    selector: 'base-icon',
    template: '',
    styles: [''],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class SVGIconComponent implements AfterViewInit, OnChanges {
    @Input() public forceHover: boolean = false;

    @HostBinding('class.hover') private _isHover: boolean = false;

    constructor(
        protected destroy$: DestroyService,
        @Optional() protected hover: HoverListenerDirective,
    ) { }

    public ngOnChanges(): void {
        this.setHover(false);
    }

    public ngAfterViewInit(): void {
        if (!this.hover) {
            return;
        }

        this.hover.hoverState$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (isHover: boolean) => {
                    this.setHover(isHover);
                }
            }
            );
    }

    private setHover(state: boolean): void {
        this._isHover = state || this.forceHover;
    }
}
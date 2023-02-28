import { Directive, HostListener, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Directive({
    selector: '[appHoverListener]'
})
export class HoverListenerDirective implements OnDestroy {

    public get hoverState$(): Observable<boolean> {
        return this._hoverStateSubject$.asObservable();
    }

    private _hoverStateSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('mouseenter')
    public onMouseEnter(): void {
        this._hoverStateSubject$.next(true);
    }

    @HostListener('mouseleave')
    public onMouseLeave(): void {
        this._hoverStateSubject$.next(false);
    }

    public ngOnDestroy(): void {
        this._hoverStateSubject$.complete();
    }
}

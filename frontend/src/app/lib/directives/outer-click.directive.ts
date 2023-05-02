import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[outer-click]',
    standalone: true
})
export class OuterClickDirective {
    @Output('outer-click')
    public outerClick: EventEmitter<void> = new EventEmitter<void>();

    constructor(element: ElementRef) {
        const listener: (event: MouseEvent) => void = (event: MouseEvent) => {
            if (event.target !== element.nativeElement) {
                this.outerClick.next();
                document.removeEventListener('click', listener);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', listener);
        }, 100);
    }

    @HostListener('click', ['$event'])
    public clickListener(event: Event): void {
        event.stopPropagation();
    }
}

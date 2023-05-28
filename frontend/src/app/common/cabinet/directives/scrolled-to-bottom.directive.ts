import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appScrolledToBottom]'
})
export class ScrolledToBottomDirective {

    @Output() public scrolledToBottom: EventEmitter<void> = new EventEmitter<void>();

    @HostListener('scroll', ['$event.currentTarget'])
    public onScroll(element: HTMLElement): void {
        // console.log(element.offsetHeight);
        // console.log(element.scrollHeight);
        // console.log(element.scrollTop);
        // console.log(element.scrollHeight - element.scrollTop === element.offsetHeight);
        if (element.scrollHeight - element.scrollTop === element.offsetHeight) {
            this.scrolledToBottom.emit();
        }
    }

}

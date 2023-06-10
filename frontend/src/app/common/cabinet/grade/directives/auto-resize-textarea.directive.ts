import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appAutoResizeTextarea]'
})
export class AutoResizeTextareaDirective {

    @Input() public maxHeight: number = 100;

    constructor() { }

    @HostListener('input', ['$event'])
    public onInput(event: Event): void {
        const element = event.target as HTMLTextAreaElement;
        element.style.height = 'auto';
        if (element.value) {
            const height = element.scrollHeight;
            element.style.height = height > this.maxHeight ? `${this.maxHeight}px` : `${height}px`;
        }
    }

}

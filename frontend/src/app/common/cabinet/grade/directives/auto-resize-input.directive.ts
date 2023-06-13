import { Directive, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appAutoResizeInput]'
})
export class AutoResizeInputDirective {

    @Input() public maxWidth: number = 350;

    constructor() { }

    @HostListener('input', ['$event'])
    public onInput(event: Event): void {
        const element = event.target as HTMLInputElement;
        element.style.width = 'min-content';
        console.log(element.size);
        if (element.value) {
            const width = element.scrollWidth;
            console.log(width);
            element.style.width = width > this.maxWidth ? `${this.maxWidth}px` : `${width}px`;
        }
    }

}

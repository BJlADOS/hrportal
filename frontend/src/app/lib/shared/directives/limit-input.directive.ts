import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[appLimitInput]'
})
export class LimitInputDirective {
    @Input() max?: number;
    @Input() min?: number;

    constructor(
        public elRef: ElementRef,
    ) { }

    @HostListener('blur', ['$event.target'])
    public onBlur(input: HTMLInputElement): void {
        if (!input.value) {
            return;
        }
        if (this.min && +input.value < this.min) {
            input.value = this.min.toString();
        } else if (this.max && +input.value > this.max) {
            input.value = this.max.toString();
        }
    }
    @HostListener('keydown', ['$event'])
    public onSubmit(event: KeyboardEvent): void {
        if (event.code === 'Enter') {
            this.onBlur(event.target as HTMLInputElement);
        }
        //this.onBlur(input);
    }
}

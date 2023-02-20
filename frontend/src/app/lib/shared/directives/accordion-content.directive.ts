import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAccordionContent]'
})
export class AccordionContentDirective {
    constructor(public templateRef: TemplateRef<HTMLElement>) { }
}

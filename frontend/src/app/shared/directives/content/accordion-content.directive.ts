import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[appAccordionContent]'
})
export class AccordionContentDirective {
    //any
    constructor(public templateRef: TemplateRef<HTMLElement>) { }

}

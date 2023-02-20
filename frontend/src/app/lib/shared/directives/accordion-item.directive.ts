import { ContentChild, Directive, Input } from '@angular/core';
import { AccordionContentDirective } from './accordion-content.directive';

@Directive({
    selector: 'appAccordionItem'
})
export class AccordionItemDirective {

    @Input() public title: string = '';
    @Input() public redirectPath: string = '';

    @ContentChild(AccordionContentDirective) public content!: AccordionContentDirective;
}

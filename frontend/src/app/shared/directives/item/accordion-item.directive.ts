import { ContentChild, Directive, Input } from '@angular/core';
import { AccordionContentDirective } from '../content/accordion-content.directive';

@Directive({
    selector: 'appAccountAccordionItem'
})
export class AccordionItemDirective {
    
    @Input() public title: string = '';
    @Input() public redirectPath: string = '';
    
    @ContentChild(AccordionContentDirective) public content!: AccordionContentDirective;
}

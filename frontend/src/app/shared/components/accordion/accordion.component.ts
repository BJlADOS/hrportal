import { Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { AccordionItemDirective } from '../../directives/item/accordion-item.directive';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccountAccordionComponent {

    public expanded: Set<number> = new Set<number>();

    @ContentChildren(AccordionItemDirective) public items!: QueryList<AccordionItemDirective>;

    constructor() { }

    public getToggleState(index: number): Function {
        return this.getToggleState.bind(this, index);
    }

    public toggleState(index: number): void {
        if (this.expanded.has(index)) {
            this.expanded.delete(index);
        } else {
            this.expanded.add(index);
        }
    }

}

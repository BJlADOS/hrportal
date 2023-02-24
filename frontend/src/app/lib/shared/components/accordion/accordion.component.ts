import { Component, ContentChildren, QueryList } from '@angular/core';
import { AccordionItemDirective } from '../../directives';
import { contentExpansion } from '../../../utils';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    animations: [
        contentExpansion,
    ]
})
export class AccordionComponent {

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

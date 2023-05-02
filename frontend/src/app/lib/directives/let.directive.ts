/* eslint-disable max-classes-per-file */
import { Directive, Inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[let]',
    standalone: true
})
export class LetDirective<T> {
    @Input()
    public let!: T;

    constructor(
        @Inject(ViewContainerRef) viewContainer: ViewContainerRef,
        @Inject(TemplateRef) templateRef: TemplateRef<LetContext<T>>,
    ) {
        viewContainer.createEmbeddedView(templateRef, new LetContext<T>(this));
    }
}

export class LetContext<T> {
    public get let(): T {
        return this._dir.let;
    }

    constructor(private readonly _dir: LetDirective<T>) { }
}


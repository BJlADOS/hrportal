import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

/**
 * Observable abstraction over ngOnDestroy to use with takeUntil
 */
@Injectable()
export class DestroyService extends ReplaySubject<void> implements OnDestroy {
    constructor() {
        super(1);
    }

    public ngOnDestroy(): void {
        this.next();
        this.complete();
    }
}
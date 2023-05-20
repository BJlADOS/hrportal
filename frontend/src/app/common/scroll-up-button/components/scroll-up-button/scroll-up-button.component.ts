import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { UpArrowIconComponent } from '../../../../../assets/img';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'scroll-up-button',
    templateUrl: 'scroll-up-button.component.html',
    styleUrls: ['scroll-up-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        UpArrowIconComponent,
        CommonModule
    ]
})
export class ScrollUpButtonComponent implements OnInit {
    public canScrollBack$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public ngOnInit(): void {
        fromEvent(window, 'scroll')
            .subscribe(() => {
                if (window.scrollY && !this.canScrollBack$.value) {
                    this.canScrollBack$.next(true);
                } else if (!window.scrollY && this.canScrollBack$.value) {
                    this.canScrollBack$.next(false);
                }
            });
    }

    public scrollBack(): void {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}

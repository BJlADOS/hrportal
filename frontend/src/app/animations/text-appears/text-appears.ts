import { trigger, transition, style, animate, AnimationTriggerMetadata } from '@angular/animations';

export const textAppears: AnimationTriggerMetadata =
    trigger('textAppears', [
        transition('void=>*', [
            style({ opacity: 0 }),
            animate('.5s', style({ opacity: 1 }))
        ])
    ]);
import { trigger, state, style, transition, animate, AnimationTriggerMetadata } from '@angular/animations';

export const rotate180: AnimationTriggerMetadata =
trigger('rotate180', [
    state('rotated', style({ transform: 'rotate(180deg)' })),
    state('still', style({ transform: 'rotate(0)' })),
    transition('rotated <=> still',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')),
]);

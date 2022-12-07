import { trigger, state, style, transition, animate, AnimationTriggerMetadata } from '@angular/animations';

export const contentExpansion: AnimationTriggerMetadata =
trigger('contentExpansion', [
    state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
    state('collapsed', style({ height: '0', opacity: 0, visibility: 'hidden', padding: 0, margin: 0 })),
    transition('expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')),
]);

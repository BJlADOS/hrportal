import { trigger, state, style, transition, animate, AnimationTriggerMetadata } from '@angular/animations';

export const contentExpansionHorizontal: AnimationTriggerMetadata =
trigger('contentExpansionHorizontal', [
    state('expanded', style({ width: '*', opacity: 1, visibility: 'visible' })),
    state('collapsed', style({ width: '0', opacity: 0, visibility: 'hidden', padding: 0, margin: 0 })),
    transition('expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')),
]);
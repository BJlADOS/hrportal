import { Provider } from '@angular/core';
import { WINDOW_SCROLLED_TO_END_TOKEN } from './window-scrolled-to-end.token';
import { filter, fromEvent } from 'rxjs';

export const WINDOW_SCROLLED_TO_END_PROVIDER: Provider = {
    provide: WINDOW_SCROLLED_TO_END_TOKEN,
    useFactory: () => {

        return fromEvent(window, 'scroll')
            .pipe(
                filter(() => {
                    return document.documentElement.scrollHeight <= document.documentElement.scrollTop + document.documentElement.clientHeight;
                })
            );
    }
};

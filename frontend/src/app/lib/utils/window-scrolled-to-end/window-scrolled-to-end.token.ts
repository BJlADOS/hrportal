import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export const WINDOW_SCROLLED_TO_END_TOKEN: InjectionToken<Observable<void>> =
    new InjectionToken<Observable<void>>('Глобальная область прокрутки браузера докручена до самого низа');

import { InjectionToken } from '@angular/core';
import { IHeaderButton } from '../../../children/cabinet/interfaces';
import { HeaderButton } from '../enums/header-button.enum';

export const BUTTONS_DATA_TOKEN: InjectionToken<Record<HeaderButton, IHeaderButton>> =
    new InjectionToken<Record<HeaderButton, IHeaderButton>>('Data for header buttons');

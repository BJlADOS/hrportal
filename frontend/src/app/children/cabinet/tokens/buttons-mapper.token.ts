import { InjectionToken } from '@angular/core';
import { UserType } from '../../../lib';
import { HeaderButton } from '../enums/header-button.enum';

export const BUTTONS_MAPPER_TOKEN: InjectionToken<Record<UserType, HeaderButton[]>> =
    new InjectionToken<Record<UserType, HeaderButton[]>>('Data mapper for header buttons');

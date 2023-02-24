import { InjectionToken } from '@angular/core';
import { IRoute } from '../../../children/cabinet/interfaces';
import { UserType } from '../enums';

export const BUTTONS_DATA_TOKEN: InjectionToken<Record<UserType, IRoute[]>> =
    new InjectionToken<Record<UserType, IRoute[]>>('Data for header buttons');

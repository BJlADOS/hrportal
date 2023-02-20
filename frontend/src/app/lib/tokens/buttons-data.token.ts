import { InjectionToken } from '@angular/core';
import { UserType } from '../enums/user-type.enum';
import { IRoute } from '../../interfaces/User';

export const BUTTONS_DATA_TOKEN: InjectionToken<Record<UserType, IRoute[]>> =
    new InjectionToken<Record<UserType, IRoute[]>>('Data for header buttons');

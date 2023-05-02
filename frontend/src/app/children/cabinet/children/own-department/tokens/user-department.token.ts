import { InjectionToken } from '@angular/core';
import { IDepartment } from '../../../../../common';
import { Subject } from 'rxjs';

export const USER_DEPARTMENT_TOKEN: InjectionToken<Subject<IDepartment>> =
    new InjectionToken<Subject<IDepartment>>('Департамент авторизованного пользователя');

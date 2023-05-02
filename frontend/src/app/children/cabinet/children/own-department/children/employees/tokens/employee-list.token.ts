import { InjectionToken } from '@angular/core';
import { BufferSubject, IPage } from '../../../../../../../lib';
import { IEmployeeRequestParams } from '../data/param-interfaces/employee-request-params.interface';
import { IUser } from '../../../../../../../common';

export const EMPLOYEE_LIST_TOKEN: InjectionToken<BufferSubject<IEmployeeRequestParams, IPage<IUser>>> =
    new InjectionToken<BufferSubject<IEmployeeRequestParams, IPage<IUser>>>('Список сотрудников');

import { inject, Provider } from '@angular/core';
import { Observable, Subject, switchMap } from 'rxjs';
import { EMPLOYEE_LIST_TOKEN } from '../tokens/employee-list.token';
import { IEmployeeRequestParams } from '../data/param-interfaces/employee-request-params.interface';
import { EmployeeService } from '../services/employee.service';
import { BufferSubject, IPage } from '../../../../../../../lib';
import { IDepartment, IUser } from '../../../../../../../common';
import { USER_DEPARTMENT_TOKEN } from '../../../tokens/user-department.token';

export const EMPLOYEE_LIST_PROVIDER: Provider = {
    provide: EMPLOYEE_LIST_TOKEN,
    useFactory: () => {
        const employeeService: EmployeeService = inject(EmployeeService);
        const department$: Subject<IDepartment> = inject(USER_DEPARTMENT_TOKEN);

        return new BufferSubject({
            operations: (params?: IEmployeeRequestParams): Observable<IPage<IUser>> => {
                return department$
                    .pipe(
                        switchMap((department: IDepartment) => {
                            if (params) {
                                params.department = [department.id];
                            } else {
                                params = {
                                    limit: 3,
                                    offset: 0,
                                    department: [department.id]
                                };
                            }

                            return employeeService.getEmployeePages(params);
                        })
                    );
            }
        });
    }
};

import { inject, Provider } from '@angular/core';
import { USER_DEPARTMENT_TOKEN } from '../tokens/user-department.token';
import { IUser, UserService } from '../../../../../common';
import { filter, map } from 'rxjs';

export const USER_DEPARTMENT_PROVIDER: Provider = {
    provide: USER_DEPARTMENT_TOKEN,
    useFactory: () => {
        const userService: UserService = inject(UserService);

        return userService.currentUserSubject$
            .pipe(
                filter((user: IUser | null) => user !== null),
                map((user: IUser | null) => {
                    return user?.currentDepartment ?? null;
                })
            );
    }
};

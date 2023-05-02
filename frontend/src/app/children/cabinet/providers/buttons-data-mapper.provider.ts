import { Provider } from '@angular/core';
import { BUTTONS_MAPPER_TOKEN } from '../tokens';
import { HeaderButton } from '../enums/header-button.enum';
import { UserType } from '../../../lib';

export const BUTTONS_DATA_MAPPER_PROVIDER: Provider = {
    provide: BUTTONS_MAPPER_TOKEN,
    useValue: {
        [UserType.employee]: [
            HeaderButton.vacancies
        ],
        [UserType.manager]: [
            HeaderButton.vacancies,
            HeaderButton.resumes,
            HeaderButton.myDepartment
        ],
        [UserType.administrator]: [
            HeaderButton.vacancies,
            HeaderButton.resumes,
            HeaderButton.departments,
            HeaderButton.myDepartment,
            HeaderButton.administration
        ],
    }
};

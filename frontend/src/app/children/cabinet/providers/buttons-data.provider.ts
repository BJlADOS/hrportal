import { Provider } from '@angular/core';
import { BUTTONS_DATA_TOKEN } from '../tokens';
import { HeaderButton } from '../enums/header-button.enum';

export const BUTTONS_DATA_PROVIDER: Provider = {
    provide: BUTTONS_DATA_TOKEN,
    useValue: {
        [HeaderButton.vacancies]: {
            name: 'Вакансии',
            path: 'cabinet/vacancies',
        },
        [HeaderButton.departments]: {
            name: 'Департаменты',
            path: 'cabinet/departments',
        },
        [HeaderButton.resumes]:{
            name: 'Резюме',
            path: 'cabinet/resumes',
        },
        [HeaderButton.myDepartment]: {
            name: 'Мой отдел',
            path: 'cabinet/own-department',
            children: [
                HeaderButton.departmentVacancies,
                HeaderButton.departmentResumes,
                HeaderButton.departmentEmployees
            ]
        },
        [HeaderButton.departmentVacancies]: {
            name: 'Вакансии',
            path: 'cabinet/own-department/vacancies',
        },
        [HeaderButton.departmentResumes]: {
            name: 'Резюме',
            path: 'cabinet/own-department/resumes',
        },
        [HeaderButton.departmentEmployees]: {
            name: 'Сотрудники',
            path: 'cabinet/own-department/employees',
        },
        [HeaderButton.administration]: {
            name: 'Администрирование',
            path: 'cabinet/administration',
        }
    }
};

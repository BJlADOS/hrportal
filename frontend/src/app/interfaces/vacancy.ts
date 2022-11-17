import { IDepartment, ISkill } from "./User";

export interface IVacancy {
    id: number;
    department: IDepartment;
    position: string;
    salary: number;
    employment: Employment;
    schedule: Schedule;
    description: string;
    requiredSkills: ISkill[];
    isActive: boolean;
    modifiedAt: number;
    createdAt: number;
}

export interface IVacancyResponseModel {
    position: string;
    salary: number;
    employment: Employment;
    schedule: Schedule;
    description: string;
    skillsIds: number[];
}


export enum Experience {
    '<1' = '<1',
    '1-3' = '1-3',
    '3-6' = '3-6',
    '>6' = '>6',
}
export enum Employment {
    'PART' = 'PART',
    'FULL' = 'FULL',
}

export enum Schedule {
    'DISTANT' = 'DISTANT',
    'PART' = 'PART',
    'SHIFT' = 'SHIFT',
    'FULL' = 'FULL',
}

export enum ScheduleRussian {
    'DISTANT' = 'Удаленная работа',
    'PART' = 'Частичная',
    'SHIFT' = 'Сменная',
    'FULL' = 'Полный день',
}

export enum EmploymentRussian {
    'PART' = 'Частичная занятость',
    'FULL' = 'Полная занятость',
}

export enum ExperienceRussian {
    '<1' = 'Меньше года',
    '1-3' = '1-3 года',
    '3-6' = '3-6 лет',
    '>6' = 'Больше 6 лет',
}

export function getExperienceRussianAsArray(): { values: string[], labels: ExperienceRussian[] } {
    const labels = Object.values(ExperienceRussian);
    const values = Object.keys(ExperienceRussian);
    const expirience = {
        values: values,
        labels: labels,
    }

    return expirience;
}
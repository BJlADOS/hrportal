import { ISelectOption } from "./select";
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
    'SHIFT' = 'Сменный график',
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

export function getExperienceRussianAsArray(): ISelectOption[] {
    const experience: { name: string, id: string }[] = [];
    Object.values(ExperienceRussian).map((value, i) => experience.push({ name: value, id: Object.values(Experience)[i] }));

    return experience;
}

export function getScheduleRussianAsArray(): ISelectOption[] {
    const schedule: { name: string, id: string }[] = [];
    Object.values(ScheduleRussian).map((value, i) => schedule.push({ name: value, id: Object.values(Schedule)[i] }));

    return schedule;
}

export function getEmploymentRussianAsArray(): ISelectOption[] {
    const employment: { name: string, id: string }[] = [];
    Object.values(EmploymentRussian).map((value, i) => employment.push({ name: value, id: Object.values(Employment)[i] }));

    return employment;
}
import { ISelectOption } from "./select";
import { IDepartment } from "./User";
import { Employment, Schedule } from "./vacancy";

export enum Ordering {
    '-time' = '-time',
    'time' = 'time',
    'salary' = 'salary',
    '-salary' = '-salary',
}

export enum OrderingRussian {
    '-time' = 'Сначала новые',
    'time' = 'Сначала старые',
    'salary' = 'По возрастанию зарплаты',
    '-salary' = 'По убыванию зарплаты',
}

export interface IFilterRequest {
    salary_min?: number;
    salary_max?: number;
    departments?: number[];
    employment?: Employment[];
    schedule?: Schedule[];
    skills?: number[];
    ordering?: Ordering;
    limit?: number;
    offset?: number;
    search?: string;
}

export interface IFilter {
    salary_min?: number;
    salary_max?: number;
    employment?: Employment[];
    departments?: IDepartment[];
    schedule?: Schedule[];
    skills?: number[];
}

export function getOrderingRussianAsArray(): ISelectOption[] {
    const ordering: { name: string, id: string }[] = [];
    Object.values(OrderingRussian).map((value, i) => ordering.push({ name: value, id: Object.values(Ordering)[i] }));

    return ordering;
}
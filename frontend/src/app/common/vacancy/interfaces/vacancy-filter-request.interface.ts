import { Employment, Ordering, Schedule } from '../../../lib';

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

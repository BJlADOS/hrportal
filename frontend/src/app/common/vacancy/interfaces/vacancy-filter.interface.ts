import { Employment, Schedule } from '../../../lib';
import { IDepartment } from '../../department';

export interface IFilter {
    salary_min?: number;
    salary_max?: number;
    employment?: Employment[];
    departments?: IDepartment[];
    schedule?: Schedule[];
    skills?: number[];
}

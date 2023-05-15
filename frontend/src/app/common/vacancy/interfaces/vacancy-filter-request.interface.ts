/* eslint-disable @typescript-eslint/naming-convention */
import { Employment, Ordering, Schedule } from '../../../lib';
import { Status } from '../../../lib/utils/enums/status.enum';

export interface IFilterRequest {
    salary_min?: number;
    salary_max?: number;
    departments?: number[];
    status?: Status;
    employment?: Employment[];
    schedule?: Schedule[];
    skills?: number[];
    ordering?: Ordering;
    limit?: number;
    offset?: number;
    search?: string;
}

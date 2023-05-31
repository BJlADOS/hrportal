/* eslint-disable @typescript-eslint/naming-convention */
import { Employment, Ordering, Schedule } from '../../../lib';
import { Status } from '../../../lib/utils/enums/status.enum';

export interface IResumeRequest {
    employment?: Employment[],
    schedule?: Schedule[],
    skills?: number[],
    department?: number[],
    status?: Status,
    ordering?: Ordering,
    search?: string,
    limit?: number,
    offset?: number,
    salary_min?: number,
    salary_max?: number,
}

import { Employment, Schedule } from '../../../lib';
import { Status } from '../../../lib/utils/enums/status.enum';


export interface IVacancyResponseModel {
    position?: string;
    salary?: number;
    employment?: Employment;
    schedule?: Schedule;
    description?: string;
    requiredSkillsIds?: number[];
    status?: Status
}

import { Employment, Schedule } from '../../../lib';


export interface IVacancyResponseModel {
    position?: string;
    salary?: number;
    employment?: Employment;
    schedule?: Schedule;
    description?: string;
    requiredSkillsIds?: number[];
}

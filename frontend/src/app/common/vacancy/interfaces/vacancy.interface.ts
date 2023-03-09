import { Employment, Schedule } from '../../../lib';
import { IDepartment } from '../../department';
import { ISkill } from '../../skill';


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

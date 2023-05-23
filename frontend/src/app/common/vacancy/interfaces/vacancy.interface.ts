import { Employment, Schedule } from '../../../lib';
import { IDepartment } from '../../department';
import { ISkill } from '../../skill';
import { Status } from '../../../lib/utils/enums/status.enum';


export interface IVacancy {
    id: number;
    department: IDepartment;
    position: string;
    salary: number;
    employment: Employment;
    schedule: Schedule;
    description: string;
    requiredSkills: ISkill[];
    status: Status;
    modifiedAt: number;
    createdAt: number;
}

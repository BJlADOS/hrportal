import { Expirience } from "./resume";
import { IDepartment, ISkill } from "./User";

export interface IVacancy {
    id: number;
    department: IDepartment;
    position: string;
    salary: number;
    expirience: Expirience,
    employment: string;
    schedule: string;
    description: string;
    requiredSkills: ISkill[];
    isActive: boolean;
    modifiedAt: number;
    createdAt: number;
}
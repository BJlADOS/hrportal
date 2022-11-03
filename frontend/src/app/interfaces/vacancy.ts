import { IDepartment, ISkill } from "./User";

export interface IVacancy {
    id: number;
    department: IDepartment;
    position: string;
    salary: number;
    employment: string;
    schedule: string;
    description: string;
    reqiredSkills: ISkill[];
    isActive: boolean;
    modifiedAt: number;
    createdAt: number;
}
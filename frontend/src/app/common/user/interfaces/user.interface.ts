import { Experience } from '../../../lib';
import { IDepartment } from '../../department';
import { ISkill } from '../../skill';

export interface IUser {
    id: number,
    fullname: string,
    email: string,
    isActive: boolean;
    contact: string,
    experience: Experience,
    currentDepartment: IDepartment | null,
    photo: string,
    existingSkills: ISkill[],
    filled: boolean,
    resumeId: number,
    isManager: boolean,
    isAdmin: boolean
}

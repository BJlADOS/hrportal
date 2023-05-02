import { Experience } from '../../../../../../../../lib';
import { IDepartment, ISkill, IUser } from '../../../../../../../../common';

export interface IEmployeeResponse {
    id: number,
    fullname: string,
    email: string,
    contact: string,
    experience: Experience,
    currentDepartment: IDepartment | null,
    photo: string,
    existingSkills: ISkill[],
    filled: boolean,
    isManager: boolean,
    isAdmin: boolean,
    emailVerified: boolean,
    isActive: boolean
}

export function employeeMapper(data: IEmployeeResponse): IUser {
    return {
        id: data.id,
        fullname: data.fullname,
        email: data.email,
        contact: data.contact,
        experience: data.experience,
        currentDepartment: data.currentDepartment,
        photo: data.photo,
        existingSkills: data.existingSkills,
        filled: data.filled,
        resumeId: data.id,
        isManager: data.isManager,
        isAdmin: data.isAdmin
    };
}

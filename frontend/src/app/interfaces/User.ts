import { Experience } from './vacancy';

export interface IUser {
    id: number,
    fullname: string,
    email: string,
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

export interface IUserUpdate {
    fullname?: string,
    email?: string,
    contact?: string,
    experience?: Experience,
    currentDepartmentId?: number,
    existingSkillsIds?: number[],
    photo?: File, // Тут не понятно, какой тип данных
}

export interface IDepartment {
    id: number,
    name: string,
    managerId: number
}

export interface IDepartmentUpdate {
    name?: string,
    managerId?: number
}

export interface ISkill {
    id: number,
    name: string
}

export interface IRoute {
    path: string,
    name: string,
}

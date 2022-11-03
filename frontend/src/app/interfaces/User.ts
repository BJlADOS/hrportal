export interface IUser {
    id: number,
    fullname: string,
    email: string,
    contact: string,
    expirience: number,
    currentDepartment: IDepartment,
    photo: string,
    existingSkills: ISkill[],
    filled: boolean,
    resumeId: number,
    isManager: boolean,
    isAdmin: boolean
}

export interface IDepartment {
    id: number,
    name: string,
    managerId: number
}

export interface ISkill {
    id: number,
    name: string
}
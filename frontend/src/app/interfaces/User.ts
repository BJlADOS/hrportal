export interface IUser {
    id: number,
    fullName: string,
    email: string,
    contact: string,
    expirience: number,
    currentDepartment: IDepartment,
    imageURL: string,
    existingSkills: ISkill[],
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
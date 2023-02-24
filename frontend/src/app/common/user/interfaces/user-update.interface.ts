import { Experience } from '../../../lib';

export interface IUserUpdate {
    fullname?: string,
    email?: string,
    contact?: string,
    experience?: Experience,
    currentDepartmentId?: number,
    existingSkillsIds?: number[],
    photo?: File, // Тут не понятно, какой тип данных
}

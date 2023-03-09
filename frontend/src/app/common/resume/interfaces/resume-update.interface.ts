import { Employment, Schedule } from '../../../lib';

export interface IResumeUpdate {
    desiredPosition: string;
    desiredSalary: number;
    desiredEmployment: Employment;
    desiredSchedule: Schedule;
    resume: File;
    isActive: boolean;
}

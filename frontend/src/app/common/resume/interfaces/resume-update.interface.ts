import { Employment, Schedule } from '../../../lib';

export interface IResumeUpdate {
    desiredPosition: string;
    desiredSalary: number;
    desiredEmployment: Employment;
    desiredSchedule: Schedule;
    file: File;
    isActive: boolean;
}

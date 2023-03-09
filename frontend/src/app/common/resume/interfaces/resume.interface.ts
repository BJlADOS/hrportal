import { Employment, Schedule } from '../../../lib';


export interface IResume {
    id: number;
    employeeId: number;
    desiredPosition: string;
    desiredSalary: number;
    desiredEmployment: Employment;
    desiredSchedule: Schedule;
    resume: string;
    isActive: boolean;
    modifiedAt: number;
    createdAt: number;
}

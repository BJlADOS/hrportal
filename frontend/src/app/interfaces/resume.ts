import { Employment, Schedule } from "./vacancy";

export interface IResume {
    id: number;
    employeeId: number;
    desiredPosition: string;
    desiredSalary: number;
    desiredEmployment: string;
    desiredSchedule: string;
    resume: string;
    isActive: boolean;
    modifiedAt: number;
    createdAt: number;
}

export interface IResumeUpdate {
    desiredPosition: string;
    desiredSalary: number;
    desiredEmployment: Employment;
    desiredSchedule: Schedule;
    resume: File;
    isActive: boolean;
}

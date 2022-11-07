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

export enum Expirience {
    '<1',
    '1-3',
    '3-6',
    '>6',
}
export enum Employment {
    'PART',
    'FULL',
}

export enum Schedule {
    'DISTANT',
    'PART',
    'SHIFT',
    'FULL',
}
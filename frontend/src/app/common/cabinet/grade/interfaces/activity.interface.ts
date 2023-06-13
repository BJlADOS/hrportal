import { ActivityStatus } from '../enums/activity-status.enum';

export interface IActivity {
    id: number;
    gradeId: number;
    employeeId: number;
    name: string;
    description?: string;
    employeeReport?: string;
    status: ActivityStatus;
}

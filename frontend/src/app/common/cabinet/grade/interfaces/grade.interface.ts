import { IActivity } from './activity.interface';

export interface IGrade {
    id?: number;
    employeeId: number;
    name?: string;
    inWork?: boolean;
    expirationDate?: number;
    activities?: IActivity[];
}

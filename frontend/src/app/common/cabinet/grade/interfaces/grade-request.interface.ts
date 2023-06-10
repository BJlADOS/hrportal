import { IActivityRequest } from './activity-request.interface';

export interface IGradeRequest {
    name: string;
    employeeId?: number;
    expirationDate: number;
    activities?: IActivityRequest[];
}

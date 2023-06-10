import { ActivityStatus } from '../enums/activity-status.enum';
import { ActivityModel } from './activity.model';

export class ActivityViewModel {
    public name: string;
    public description: string;
    public status: ActivityStatus;
    public employeeReport: string;
    public id?: number;

    constructor(data: ActivityModel) {
        this.name = data.name?? '';
        this.description = data.description?? '';
        this.status = data.status;
        this.employeeReport = data.employeeReport?? '';
        this.id = data.id;
    }
}

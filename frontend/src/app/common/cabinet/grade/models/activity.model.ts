import { ActivityStatus } from '../enums/activity-status.enum';
import { IActivity } from '../interfaces/activity.interface';

export class ActivityModel {
    public id?: number;
    public gradeId?: number;
    public employeeId: number;
    public name?: string;
    public description?: string;
    public employeeReport?: string;
    public status: ActivityStatus;

    //FE Only
    public isValid: boolean;

    constructor(data: Partial<IActivity>, isValid: boolean = false) {
        this.id = data.id;
        this.gradeId = data.gradeId;
        this.employeeId = data.employeeId!;
        this.name = data.name;
        this.description = data.description;
        this.employeeReport = data.employeeReport;
        this.status = data.status ?? ActivityStatus.active;
        this.isValid = isValid;
    }
}

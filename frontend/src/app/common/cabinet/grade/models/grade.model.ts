import { ActivityModel } from './activity.model';
import { IGrade } from '../interfaces/grade.interface';

export class GradeModel {
    public id?: number;
    public employeeId: number;
    public name: string;
    public inWork: boolean;
    public expirationDate: number;
    public activities: ActivityModel[];

    constructor(data: IGrade) {
        this.id = data.id;
        this.employeeId = data.employeeId;
        this.name = data.name?? '';
        this.inWork = data.inWork?? true;
        this.expirationDate = data.expirationDate?? 0;
        this.activities = data.activities? data.activities.map(a => new ActivityModel(a)) : [];
    }
}

import { ActivityModel } from '../../../../../../../common/cabinet/grade/models/activity.model';
import { GradeModel } from '../../../../../../../common/cabinet/grade/models/grade.model';
import { IUser } from '../../../../../../../common';

export class ActivityListItemViewModel {
    public activityList: ActivityModel[];
    public gradeName: string;
    public employeeName: string;

    constructor(
        activityList: ActivityModel[],
        grade: GradeModel,
        employee: IUser
    ) {
        this.activityList = activityList;
        this.gradeName = grade.name;
        this.employeeName = employee.fullname;
    }
}

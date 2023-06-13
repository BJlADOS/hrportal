import { ActivityStatus } from '../../../../../common/cabinet/grade/enums/activity-status.enum';

export interface INotificationActivityChanged {
    managerId: number,
    activityId: number,
    decision: Pick<typeof ActivityStatus, 'returned' | 'completed' | 'canceled'>
}

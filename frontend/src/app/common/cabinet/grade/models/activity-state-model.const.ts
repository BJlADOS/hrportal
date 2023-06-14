import { ActivityStatus } from '../enums/activity-status.enum';

export const ActivityStateModelConst: Record<any, any> = {
    [ActivityStatus.active]: {
        className: '_state-active',
        text: 'Активна',
    },
    [ActivityStatus.inWork]: {
        className: '_state-in-work',
        text: 'В работе',
    },
    [ActivityStatus.onReview]: {
        className: '_state-on-review',
        text: 'На проверке',
    },
    [ActivityStatus.returned]: {
        className: '_state-returned',
        text: 'Возвращена',
    },
    [ActivityStatus.completed]: {
        className: '_state-completed',
        text: 'Выполнена',
    },
    [ActivityStatus.canceled]: {
        className: '_state-canceled',
        text: 'Отменена',
    }
};

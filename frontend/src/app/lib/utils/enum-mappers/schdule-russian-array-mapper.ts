import { Schedule, ScheduleRussian } from '../enums';
import { ISelectOption } from '../../forms';


export function getScheduleRussianAsArray(): ISelectOption[] {
    const schedule: ISelectOption[] = [];
    Object.values(ScheduleRussian).map((value, i) => schedule.push({ name: value, id: Object.values(Schedule)[i] }));

    return schedule;
}

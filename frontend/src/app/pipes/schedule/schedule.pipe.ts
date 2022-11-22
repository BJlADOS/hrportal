import { Pipe, PipeTransform } from '@angular/core';
import { Schedule, ScheduleRussian } from 'src/app/interfaces/vacancy';

@Pipe({
  name: 'schedule'
})
export class SchedulePipe implements PipeTransform {

  transform(value: Schedule, ...args: unknown[]): string {
    return ScheduleRussian[value];
  }

}

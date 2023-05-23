import { Pipe, PipeTransform } from '@angular/core';
import { declination } from '../../../../../../../lib';

@Pipe({
    name: 'employeeDeclination',
})
export class EmployeeDeclinationPipe implements PipeTransform {
    public transform(value: number): string {
        return declination(value ?? 0, ['Сотрудник', 'Сотрудника', 'Сотрудников']);
    }
}

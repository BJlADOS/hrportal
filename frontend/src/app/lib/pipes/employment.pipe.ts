import { Pipe, PipeTransform } from '@angular/core';
import { Employment, EmploymentRussian } from 'src/app/interfaces/vacancy';

@Pipe({
    name: 'employment'
})
export class EmploymentPipe implements PipeTransform {
    public transform(value: Employment, ...args: unknown[]): string {
        return EmploymentRussian[value];
    }
}

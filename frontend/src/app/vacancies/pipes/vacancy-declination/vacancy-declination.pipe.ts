import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vacancyDeclination'
})
export class VacancyDeclinationPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    // Склонение слова Вакансия
    const cases = [2, 0, 1, 1, 1, 2];
    return value + ' Ваканс' + ['ия', 'ии', 'ий'][value % 100 > 4 && value % 100 < 20 ? 2 : cases[value % 10 < 5 ? value % 10 : 5]];
  }

}

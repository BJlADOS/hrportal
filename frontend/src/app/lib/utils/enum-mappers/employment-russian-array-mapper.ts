import { Employment, EmploymentRussian } from '../enums';
import { ISelectOption } from '../../forms';


export function getEmploymentRussianAsArray(): ISelectOption[] {
    const employment: ISelectOption[] = [];
    Object.values(EmploymentRussian).map((value, i) => employment.push({ name: value, id: Object.values(Employment)[i] }));

    return employment;
}

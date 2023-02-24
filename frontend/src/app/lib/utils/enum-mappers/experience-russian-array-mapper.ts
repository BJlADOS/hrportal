import { Experience, ExperienceRussian } from '../enums';
import { ISelectOption } from '../../forms';


export function getExperienceRussianAsArray(): ISelectOption[] {
    const experience: ISelectOption[] = [];
    Object.values(ExperienceRussian).map((value, i) => experience.push({ name: value, id: Object.values(Experience)[i] }));

    return experience;
}

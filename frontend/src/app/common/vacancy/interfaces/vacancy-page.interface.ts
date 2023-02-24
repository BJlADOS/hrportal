import { IVacancy } from './vacancy.interface';


export interface IVacancyPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IVacancy[];
}

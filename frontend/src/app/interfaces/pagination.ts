import { IVacancy } from "./vacancy";

export interface IVacancyPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IVacancy[];
}
import { IResume } from './resume.interface';

export interface IResumePage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IResume[];
}

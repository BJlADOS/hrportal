export interface IPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: any[];
}

export enum ISort {
    'salary' = 'salary',
    '-salary' = '-salary',
    'time' = 'time',
    '-time' = '-time',
}
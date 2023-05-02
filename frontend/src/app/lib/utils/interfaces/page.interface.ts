/**
 * Интерфейс страницы для пагинации
 * */
export interface IPage<TPageData> {
    count: number;
    next: string | null;
    previous: string | null;
    results: TPageData[];
}

export function pageMapper<TFrom, TTo>(page: IPage<TFrom>, mapper: (data: TFrom) => TTo): IPage<TTo> {
    return {
        count: page.count,
        previous: page.previous,
        next: page.next,
        results: page.results.map(mapper)
    };
}

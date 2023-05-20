/**
 * Интерфейс страницы для пагинации
 * */
export interface IPage<TPageData> {
    /** Общее количество элементов, по которому выдаются данные для пагинации */
    count: number;
    /** URL для получения данных следующей страницы */
    next: string | null;
    /** URL для получения данных предыдущей страницы */
    previous: string | null;
    /** Данные страницы */
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

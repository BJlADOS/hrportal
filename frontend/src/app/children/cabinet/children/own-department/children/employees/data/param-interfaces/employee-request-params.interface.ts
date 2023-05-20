import { IEmployeeFilterParams } from '../../interfaces/employee-filter-params.interface';

export interface IEmployeeRequestParams extends IEmployeeFilterParams {
    /** Поиск объекта (по названию должности, имени, email) */
    search?: string,
    /** Количество результатов, возвращаемых на страницу */
    limit?: number,
    /** Индекс, начиная с которого возвращаются результаты */
    offset?: number
}

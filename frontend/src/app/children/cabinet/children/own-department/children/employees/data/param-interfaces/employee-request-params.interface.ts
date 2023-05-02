import { Experience } from '../../../../../../../../lib';

export interface IEmployeeRequestParams {
    /** Список ID отделов */
    department?: number[],
    /** Опыт пользователя */
    experience?: Experience[],
    /** Статус пользователя - активен или не активен */
    active?: boolean,
    /** Список ID навыков */
    skills?: number[],
    /** Поиск объекта (по названию должности, имени, email) */
    search?: string,
    /** Количество результатов, возвращаемых на страницу */
    limit?: number,
    /** Индекс, начиная с которого возвращаются результаты */
    offset?: number
}

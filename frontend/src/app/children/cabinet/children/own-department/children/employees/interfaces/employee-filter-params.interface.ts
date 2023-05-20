export interface IEmployeeFilterParams {
    /** Список ID отделов */
    department?: number[],
    /** Опыт пользователя */
    experience?: number[],
    /** Статус пользователя - активен или не активен */
    active?: boolean,
    /** Список ID навыков */
    skills?: number[],
}

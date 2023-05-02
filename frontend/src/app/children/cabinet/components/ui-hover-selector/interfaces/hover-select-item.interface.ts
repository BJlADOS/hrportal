export interface IHoverSelectItem {
    /** Название кнопки */
    buttonTitle: string,
    /** Путь для перехода */
    path: string,
    /** Список дочерних элементов */
    children?: IHoverSelectItem[]
}

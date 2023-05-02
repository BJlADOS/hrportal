import { HeaderButton } from '../enums/header-button.enum';

export interface IHeaderButton {
    /** Название кнопки */
    name: string,
    /** Путь перехода для кнопки */
    path: string,
    /** Вложенные кнопки */
    children?: HeaderButton[]
}

import { ISelectOption } from '../../forms';
import { Ordering, OrderingRussian } from '../enums';


export function getOrderingRussianAsArray(): ISelectOption[] {
    const ordering: Array<{ name: string, id: string }> = [];
    Object.values(OrderingRussian).map((value, i) => ordering.push({ name: value, id: Object.values(Ordering)[i] }));

    return ordering;
}

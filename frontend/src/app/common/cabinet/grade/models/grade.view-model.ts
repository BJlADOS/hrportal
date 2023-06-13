import { GradeModel } from './grade.model';

export class GradeViewModel {
    public name: string;
    public expirationDate: Date;

    constructor(data: GradeModel) {
        this.name = data.name;
        this.expirationDate = new Date(data.expirationDate);
    }
}

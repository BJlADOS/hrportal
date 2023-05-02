import { FormGroup } from '@angular/forms';
import { Experience, ExperienceRussian, ISelectOption } from '../../../../../../../lib';

export class EmployeeFilterViewModel {
    public form!: FormGroup;
    public experienceOptions: ISelectOption[] = this.getExperienceOptions();

    private getExperienceOptions(): ISelectOption[] {
        return Object.values(Experience).map((value: Experience) => {
            return {
                name: ExperienceRussian[value],
                id: value
            };
        });
    }
}

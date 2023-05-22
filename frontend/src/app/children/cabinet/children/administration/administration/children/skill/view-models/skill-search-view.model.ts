import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class SkillSearchViewModel {
    public form!: FormGroup;
    public showMoreMode$: BehaviorSubject<boolean> = new BehaviorSubject(false);
}

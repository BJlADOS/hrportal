import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class SkillAdditionViewModel {
    public form!: FormGroup;
    public isAdditionMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public toggleAdditionMode(): void {
        this.isAdditionMode$.next(!this.isAdditionMode$.value);
    }
}

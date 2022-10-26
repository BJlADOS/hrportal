import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class FormManager {
    private static _formManager: FormManager;

    public static getInstance(): FormManager {
        if (FormManager._formManager) {
            return FormManager._formManager;
        }
        FormManager._formManager = new FormManager();

        return FormManager._formManager;
    }

}

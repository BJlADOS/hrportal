import { ComponentRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalContainerComponent } from 'src/app/shared/components/modal-container/modal-container.component';
import { Modal } from './modal';

export class ModalRef {
    private _result$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    
    constructor(
        private _modalContainer: ComponentRef<ModalContainerComponent>,
        private _modal: ComponentRef<Modal>
    ) {
        this._modal.instance.modalInstanse = this;
    }

    public close(output: any): void {
        this._result$.next(output);
        this.destroy$();
    }

    public dismiss(output: any): void {
        this._result$.error(output);
        this.destroy$();
    }

    public onResult(): Observable<any> {
        return this._result$.asObservable();
    }

    private destroy$(): void {
        this._modal.destroy();
        this._modalContainer.destroy();
        this._result$.complete();
    }
}
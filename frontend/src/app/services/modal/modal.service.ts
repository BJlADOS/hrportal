import { ApplicationRef, ComponentRef, Injectable, Type } from '@angular/core';
import { Modal } from 'src/app/classes/modal/modal';
import { ModalRef } from 'src/app/classes/modal/modalRef';
import { ModalContainerComponent } from 'src/app/shared/components/modal-container/modal-container.component';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private _modalContainer!: HTMLDivElement;

    constructor(
        private _appRef: ApplicationRef,
    ) { }

    public open<T extends Modal>(component: Type<T>, inputs?: any): ModalRef {
        this.setupModalContainerDiv();

        const modalContainerRef: ComponentRef<ModalContainerComponent> = this._appRef.bootstrap(ModalContainerComponent, this._modalContainer);

        const modalComponentRef: ComponentRef<T> = modalContainerRef.instance.createModal(component);

        this._modalContainer.addEventListener('click', (el: MouseEvent) => {
            if ((el.target as HTMLDivElement).classList.contains('modal-backdrop')) {
                modalComponentRef.instance.close();
            }
        });
        if (inputs) {
            modalComponentRef.instance.onInjectInputs(inputs);
        }

        const modalRef: ModalRef = new ModalRef(modalContainerRef, modalComponentRef);

        return modalRef;
    }

    private setupModalContainerDiv(): void {
        this._modalContainer = document.createElement('div');
        document.getElementsByTagName('body')[0].appendChild(this._modalContainer);
    }
}

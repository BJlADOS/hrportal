import { Component, ComponentRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Modal } from 'src/app/classes/modal/modal';

@Component({
    selector: 'app-modal-container',
    templateUrl: './modal-container.component.html',
    styleUrls: ['./modal-container.component.scss']
})
export class ModalContainerComponent {

    @ViewChild('modalContainer', { read: ViewContainerRef })

    private _modalContainer!: ViewContainerRef;
    
    constructor() { }

    public createModal<T extends Modal>(component: Type<T>): ComponentRef<T> {
        this._modalContainer.clear();
        return this._modalContainer.createComponent(component);
    }

}

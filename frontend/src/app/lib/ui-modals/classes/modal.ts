import { ModalRef } from './modalRef';

export abstract class Modal {
    public modalInstanse!: ModalRef;

    public abstract onInjectInputs(inputs: any): void;

    public close(output?: any): void {
        this.modalInstanse.close(output);
    }

    public dismiss(output?: any): void {
        this.modalInstanse.dismiss(output);
    }
}
import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Directive({
    selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

    @Output() public fileDropped = new EventEmitter<FileList>();

    @HostBinding('class.fileover') private _fileover: boolean = false;

    public get dragState$(): Observable<boolean> {
        return this._dragStateSubject$.asObservable();
    }

    private _dragStateSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this._fileover = true;
        this._dragStateSubject$.next(this._fileover);
    }

    @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('drop', ['$event']) public onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this._fileover = false;
        this._dragStateSubject$.next(this._fileover);
        const files: FileList = event.dataTransfer!.files;
        if (files.length > 0) {
            this.fileDropped.emit(files);
        }
    }

}

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @Output() public fileDropped = new EventEmitter<FileList>();

  @HostBinding('class.fileover') public fileOver: boolean = false;

  constructor() { }

  @HostListener('dragover', ['$event']) public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    const files: FileList = event.dataTransfer!.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
  }

}

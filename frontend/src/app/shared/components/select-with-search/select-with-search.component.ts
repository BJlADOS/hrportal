import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { stringify } from 'querystring';
import { debounceTime, takeUntil } from 'rxjs';
import { DestroyService } from 'src/app/services/destoy/destroy.service';

@Component({
  selector: 'app-select-with-search',
  templateUrl: './select-with-search.component.html',
  styleUrls: ['./select-with-search.component.scss']
})
export class SelectWithSearchComponent implements OnInit {

  @Input() options: any[] =[];
  @Input() title: string = 'Select';
  @Input() startValue: any;
  @Input() alreadySelected: any[] = [];
  @Input() isActive: boolean = false;

  @Output() currentValueChange = new EventEmitter();
  @Output() closed = new EventEmitter();


  public searchControl: FormControl<any> = new FormControl();
  public optionsOriginal: any[] = [];
  public dropdownOpen: boolean = false;
  public visibleOptions: number = 3;

  constructor(
      private elem: ElementRef,
      private _destroy$: DestroyService,
  ) { }

  public ngOnInit(): void { 
    this.optionsOriginal = [...this.options];
    this.options = this.optionsOriginal.filter((item) => {
      if (this.alreadySelected.find((value) => value.id === item.id)) {
        return false;
      }
      return true;
    });
    this.checkOptions();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this._destroy$)
      )
      .subscribe(term => this.search(term));
  }

  public search(term: string): void {
    this.options = this.optionsOriginal.filter((item) => {
      if (this.alreadySelected.find((value) => value.id === item.id)) {
        return false;
      }

     return item.name.toLowerCase().includes(term.toLowerCase());
    });

    this.checkOptions();
  }

  public get dropdownElement(): Element {
    return this.elem.nativeElement.querySelector('.dropdown-list');
  }

  public closeDropdown() {
      this.closed.emit(this.isActive);
      this.isActive = !this.isActive;
  }

  public selectByIndex(i: number) {
      let value = this.options[i];
      this.select(value);
  }

  public select(value: any) {
      this.options = this.options.filter(item => item.id !== value.id)
      this.checkOptions();
      // this.closeDropdown();
      this.currentValueChange.emit(value);
      this.isActive = !this.isActive;
  }

  private checkOptions(): void {
    if(this.options.length < 3) {
      this.visibleOptions = this.options.length === 0 ? 1 : this.options.length;
    } else {
      this.visibleOptions = 3;
    }
  }

}

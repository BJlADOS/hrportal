import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { DestroyService } from 'src/app/services/destoy/destroy.service';

export const CUSTOM_SEARCH_SELECT_FORM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SearchSelectFormComponent),
  multi: true
};

@Component({
  selector: 'app-search-select-form',
  templateUrl: './search-select-form.component.html',
  styleUrls: ['./search-select-form.component.scss'],
  animations: [contentExpansion],
  providers: [CUSTOM_SEARCH_SELECT_FORM_VALUE_ACCESSOR],
})
export class SearchSelectFormComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] =[];
  @Input() title: string = 'Select';
  @Input() required: boolean = false;
  @Input() selected: any;

  public searchControl: FormControl<any> = new FormControl();

  public currentValue: any;
  public dropdownOpen: boolean = false;
  public disabled: boolean = false;
  public onChange: any;
  public optionsOriginal: any[] = [];
  public visibleOptions: number = 3;

  constructor(
      private elem: ElementRef,
      private _destroy$: DestroyService,
  ) { }

  public writeValue(obj: any): void {
    // Если у объекта есть свойство id, то берём сам объект, иначе ищем объект с таким id
    this.currentValue = obj?.id ? obj : this.options.find((option) => option.id === obj);
    this.options = this.optionsOriginal.filter((item) => {
      return this.currentValue?.id !== item.id;
    });
    this.closeDropdown();
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    this.closeDropdown();
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public ngOnInit(): void {
    this.optionsOriginal = [...this.options];
    this.checkOptions();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this._destroy$)
      )
      .subscribe(term => this.search(term));
  }

  public get dropdownElement(): Element {return this.elem.nativeElement.querySelector('.dropdown-list')}

  public search(term: string): void {
    this.options = this.optionsOriginal.filter((item) => {
     return this.currentValue?.id === item.id ? false : item.name.toLowerCase().includes(term.toLowerCase());
    });

    this.checkOptions();
  }

  public closeDropdown(): void {
      this.dropdownElement.setAttribute('aria-expanded', "false");
      this.dropdownOpen = false;
  }

  public selectByIndex(i: number): void {
      let value = this.options[i];
      this.select(value);
  }

  public select(value: any): void {
      this.currentValue = value;
      console.log(this.optionsOriginal);
      this.options = this.optionsOriginal.filter((item) => {
        return this.currentValue?.id !== item.id;
      });
      this.closeDropdown();
      this.onChange(value.id);
  }

  public toggleDropdown():void {
    if (this.disabled) {
      return;
    }
    console.log(this.dropdownOpen);
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? "true" : "false");
  }

  private checkOptions(): void {
    if(this.options.length < 3) {
      this.visibleOptions = this.options.length === 0 ? 1 : this.options.length;
    } else {
      this.visibleOptions = 3;
    }
  }

}

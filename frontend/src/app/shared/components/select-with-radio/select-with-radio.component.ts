import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { rotate180 } from 'src/app/animations/rotate/rotate180';

export const CUSTOM_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectWithRadioComponent),
  multi: true
};

@Component({
  selector: 'app-select-with-radio',
  templateUrl: './select-with-radio.component.html',
  styleUrls: ['./select-with-radio.component.scss'],
  animations: [contentExpansion, rotate180],
  providers: [CUSTOM_SELECT_VALUE_ACCESSOR]
})
export class SelectWithRadioComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] =[];
  @Input() title: string = 'Select';
  @Input() required: boolean = false;
  @Input() reset$: Observable<null> = of(null);

  public currentValue: any;
  public dropdownOpen: boolean = false;
  public disabled: boolean = false;
  public onChange: any;

  public edited: boolean = false;

  constructor(
      private elem: ElementRef
  ) { }

  public writeValue(obj: any): void {
    // Если у объекта есть свойство id, то берём сам объект, иначе ищем объект с таким id
    this.currentValue = obj?.id ? obj : this.options.find((option) => option.id === obj);
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
    this.reset$.subscribe(() => {
      this.edited = false;
    });
  }

  public get dropdownElement(): Element {return this.elem.nativeElement.querySelector('.dropdown-list')}

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
      this.edited = true;
      this.closeDropdown();
      this.onChange(value);
  }

  public toggleDropdown():void {
    if (this.disabled) {
      return;
    }
    
    this.dropdownOpen = !this.dropdownOpen;
    this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? "true" : "false");
  }

}

import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { contentExpansion } from '../../../animations';

export const CUSTOM_SELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
};

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    animations: [contentExpansion],
    providers: [CUSTOM_SELECT_VALUE_ACCESSOR]
})
export class SelectComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] =[];
  @Input() title: string = 'Select';
  @Input() required: boolean = false;

  public currentValue: any;
  public dropdownOpen: boolean = false;
  public disabled: boolean = false;
  public onChange: any;

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
  }

  public get dropdownElement(): Element {return this.elem.nativeElement.querySelector('.dropdown-list');}

  public closeDropdown(): void {
      this.dropdownElement.setAttribute('aria-expanded', 'false');
      this.dropdownOpen = false;
  }

  public selectByIndex(i: number): void {
      const value = this.options[i];
      this.select(value);
  }

  public select(value: any): void {
      this.currentValue = value;
      this.closeDropdown();
      this.onChange(value);
  }

  public toggleDropdown():void {
      if (this.disabled) {
          return;
      }

      this.dropdownOpen = !this.dropdownOpen;
      this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? 'true' : 'false');
  }

}

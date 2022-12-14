import { Component, ElementRef, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';
import { contentExpansionHorizontal } from 'src/app/animations/content-expansion/content-expansion-horizontal';
import { rotate180 } from 'src/app/animations/rotate/rotate180';

export const CUSTOM_SMALL_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectSmallComponent),
  multi: true
};

@Component({
  selector: 'app-select-small',
  templateUrl: './select-small.component.html',
  styleUrls: ['./select-small.component.scss'],
  animations: [contentExpansion, contentExpansionHorizontal, rotate180],
  providers: [CUSTOM_SMALL_SELECT_VALUE_ACCESSOR]
})
export class SelectSmallComponent implements OnInit, ControlValueAccessor {

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

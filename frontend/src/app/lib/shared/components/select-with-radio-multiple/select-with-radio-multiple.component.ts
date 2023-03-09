import { Component, ElementRef, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { contentExpansion, rotate180 } from '../../../utils';


@Component({
    selector: 'app-select-with-radio-multiple',
    templateUrl: './select-with-radio-multiple.component.html',
    styleUrls: ['./select-with-radio-multiple.component.scss'],
    animations: [contentExpansion, rotate180],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectWithRadioMultipleComponent),
        multi: true
    }]
})
export class SelectWithRadioMultipleComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] =[];
  @Input() required: boolean = false;
  @Input() reset$: Observable<null> = of(null);

  public currentValue: any[] = [];
  public disabled: boolean = false;
  public onChange: any;

  public edited: boolean = false;

  constructor(
      private elem: ElementRef
  ) { }

  public writeValue(obj: any): void {
      // Если у объекта есть свойство id, то берём сам объект, иначе ищем объект с таким id
      this.currentValue = obj;
  }
  public registerOnChange(fn: any): void {
      this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
  }
  public setDisabledState?(isDisabled: boolean): void {
      this.disabled = isDisabled;
  }

  public ngOnInit(): void {
      this.reset$.subscribe(() => {
          this.edited = false;
      });
  }

  public selectByIndex(i: number): void {
      const value = this.options[i];
      this.select(value);
  }

  public select(value: any): void {
      if (this.currentValue.find((item) => item.id === value.id)) {
          this.currentValue = this.currentValue.filter((item) => item.id !== value.id);
      } else {
          this.currentValue.push(value);
      }
      this.edited = true;
      this.onChange(this.currentValue);
  }

  public checkSelected(value: any): boolean {
      return this.currentValue.find((item) => item.id === value.id) ? true : false;
  }

}

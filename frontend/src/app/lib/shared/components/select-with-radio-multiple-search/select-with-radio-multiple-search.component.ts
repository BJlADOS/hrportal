import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs';
import { contentExpansionHorizontal, DestroyService } from '../../../utils';


@Component({
    selector: 'app-select-with-radio-multiple-search',
    templateUrl: './select-with-radio-multiple-search.component.html',
    styleUrls: ['./select-with-radio-multiple-search.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectWithRadioMultipleSearchComponent),
        multi: true
    }],
    animations: [contentExpansionHorizontal],
})
export class SelectWithRadioMultipleSearchComponent implements OnInit, ControlValueAccessor {

  @Input() options: any[] = [];
  @Input() title: string = 'Select';
  @Input() isActive: boolean = false;

  @Output() currentValueChange = new EventEmitter();
  @Output() closed = new EventEmitter();


  public searchControl: FormControl<any> = new FormControl();
  public selectedOptions: any[] = [];
  public optionsOriginal: any[] = [];
  public visibleOptions: number = 6;
  public disabled: boolean = false;

  public onChange: any;

  constructor(
      private _destroy$: DestroyService,
  ) { }

  public writeValue(obj: any[]): void {
      this.selectedOptions = obj;
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
      this.optionsOriginal = [...this.options];
      console.log(this.options);
      this.checkOptions();
      this.searchControl.valueChanges
          .pipe(
              debounceTime(300),
              takeUntil(this._destroy$)
          )
          .subscribe(term => this.search(term));
  }

  public search(term: string): void {
      this.options = this.optionsOriginal.filter((item) => item.name.toLowerCase().includes(term.toLowerCase()));
      this.checkOptions();
  }

  public selectByIndex(i: number) {
      const value = this.options[i];
      this.select(value);
  }

  public select(value: any) {
      if (this.selectedOptions.find((item) => item.id === value.id)) {
          this.selectedOptions = this.selectedOptions.filter((item) => item.id !== value.id);
      } else {
          this.selectedOptions.push(value);
      }
      this.checkOptions();
      this.onChange(this.selectedOptions);
  }

  public checkSelected(value: any): boolean {
      return this.selectedOptions.find(item => item.id === value.id) ? true : false;
  }

  public reset(): void {
      this.searchControl.patchValue('');
  }

  private checkOptions(): void {
      if(this.options.length < 6) {
          this.visibleOptions = this.options.length === 0 ? 1 : this.options.length;
      } else {
          this.visibleOptions = 6;
      }
  }

}

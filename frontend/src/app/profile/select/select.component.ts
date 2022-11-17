import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { contentExpansion } from 'src/app/animations/content-expansion/content-expansion';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [contentExpansion]
})
export class SelectComponent implements OnInit {

  @Input() options: any[] =[];
  @Input() title: string = 'Select';
  @Input() startValue: any;
  @Output() currentValueChange = new EventEmitter();

  public currentValue: any;
  public dropdownOpen: boolean = false;

  constructor(
      private elem: ElementRef
  ) { }

  public ngOnInit(): void {
    if (this.startValue) {
      this.currentValue = this.options.find((option) => option.id === this.startValue);
    } 
  }

  public get dropdownElement(): Element {return this.elem.nativeElement.querySelector('.dropdown-list')}

  public closeDropdown() {
      this.dropdownElement.setAttribute('aria-expanded', "false");
      this.dropdownOpen = false;
  }

  public selectByIndex(i: number) {
      let value = this.options[i];
      this.select(value);
  }

  public select(value: any) {
      this.currentValue = value;
      this.closeDropdown();
      this.currentValueChange.emit(this.currentValue);
  }

  public toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
      this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? "true" : "false");
  }

}

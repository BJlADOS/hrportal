import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithRadioComponent } from './select-with-radio.component';

describe('SelectWithRadioComponent', () => {
  let component: SelectWithRadioComponent;
  let fixture: ComponentFixture<SelectWithRadioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectWithRadioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWithRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

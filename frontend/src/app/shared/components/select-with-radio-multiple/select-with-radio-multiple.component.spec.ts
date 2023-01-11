import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithRadioMultipleComponent } from './select-with-radio-multiple.component';

describe('SelectWithRadioMultipleComponent', () => {
  let component: SelectWithRadioMultipleComponent;
  let fixture: ComponentFixture<SelectWithRadioMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectWithRadioMultipleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWithRadioMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

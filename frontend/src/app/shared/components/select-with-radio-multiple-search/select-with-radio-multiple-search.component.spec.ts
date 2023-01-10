import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithRadioMultipleSearchComponent } from './select-with-radio-multiple-search.component';

describe('SelectWithRadioMultipleSearchComponent', () => {
  let component: SelectWithRadioMultipleSearchComponent;
  let fixture: ComponentFixture<SelectWithRadioMultipleSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectWithRadioMultipleSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWithRadioMultipleSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

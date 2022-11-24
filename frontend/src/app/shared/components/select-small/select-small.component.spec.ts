import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSmallComponent } from './select-small.component';

describe('SelectComponent', () => {
  let component: SelectSmallComponent;
  let fixture: ComponentFixture<SelectSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

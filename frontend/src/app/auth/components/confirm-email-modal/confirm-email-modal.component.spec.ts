import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailModalComponent } from './confirm-email-modal.component';

describe('ConfirmEmailModalComponent', () => {
  let component: ConfirmEmailModalComponent;
  let fixture: ComponentFixture<ConfirmEmailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

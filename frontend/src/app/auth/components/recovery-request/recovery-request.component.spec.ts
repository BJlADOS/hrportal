import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryRequestComponent } from './recovery-request.component';

describe('RecoveryRequestComponent', () => {
  let component: RecoveryRequestComponent;
  let fixture: ComponentFixture<RecoveryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoveryRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeResponseModalComponent } from './resume-response-modal.component';

describe('ResumeResponseModalComponent', () => {
  let component: ResumeResponseModalComponent;
  let fixture: ComponentFixture<ResumeResponseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeResponseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

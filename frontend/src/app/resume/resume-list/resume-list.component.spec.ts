import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeListComponent } from './resume-list.component';

describe('ResumeListComponent', () => {
  let component: ResumeListComponent;
  let fixture: ComponentFixture<ResumeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

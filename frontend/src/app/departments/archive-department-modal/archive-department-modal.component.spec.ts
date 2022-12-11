import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDepartmentModalComponent } from './archive-department-modal.component';

describe('ArchiveDepartmentModalComponent', () => {
  let component: ArchiveDepartmentModalComponent;
  let fixture: ComponentFixture<ArchiveDepartmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDepartmentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveDepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDepartmentModalComponent } from './edit-department-modal.component';

describe('EditDepartmentModalComponent', () => {
  let component: EditDepartmentModalComponent;
  let fixture: ComponentFixture<EditDepartmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDepartmentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

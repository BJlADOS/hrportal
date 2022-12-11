import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDepartmentModalComponent } from './delete-department-modal.component';

describe('DeleteDepartmentModalComponent', () => {
  let component: DeleteDepartmentModalComponent;
  let fixture: ComponentFixture<DeleteDepartmentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDepartmentModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDepartmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

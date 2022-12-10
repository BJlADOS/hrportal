import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentsMainComponent } from './departments-main.component';

describe('DepartmentsMainComponent', () => {
  let component: DepartmentsMainComponent;
  let fixture: ComponentFixture<DepartmentsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentsMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

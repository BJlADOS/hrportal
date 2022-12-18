import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVacancyComponent } from './create-vacancy.component';

describe('CreateVacancyComponent', () => {
  let component: CreateVacancyComponent;
  let fixture: ComponentFixture<CreateVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVacancyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

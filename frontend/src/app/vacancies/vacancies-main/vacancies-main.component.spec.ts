import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacanciesMainComponent } from './vacancies-main.component';

describe('VacanciesMainComponent', () => {
  let component: VacanciesMainComponent;
  let fixture: ComponentFixture<VacanciesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VacanciesMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacanciesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

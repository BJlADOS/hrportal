import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSelectFormComponent } from './search-select-form.component';

describe('SearchSelectFormComponent', () => {
  let component: SearchSelectFormComponent;
  let fixture: ComponentFixture<SearchSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSelectFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

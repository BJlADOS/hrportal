import { TestBed } from '@angular/core/testing';

import { VacanciesSearchService } from './vacancies-search.service';

describe('SearchService', () => {
  let service: VacanciesSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacanciesSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

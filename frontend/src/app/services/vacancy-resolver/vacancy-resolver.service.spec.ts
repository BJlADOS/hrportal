import { TestBed } from '@angular/core/testing';

import { VacancyResolverService } from './vacancy-resolver.service';

describe('VacancyResolverService', () => {
  let service: VacancyResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacancyResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

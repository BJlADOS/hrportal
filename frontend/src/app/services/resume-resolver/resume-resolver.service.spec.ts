import { TestBed } from '@angular/core/testing';

import { ResumeResolverService } from './resume-resolver.service';

describe('ResumeResolverService', () => {
  let service: ResumeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResumeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { AdvisingStatsService } from './advising-stats.service';

describe('AdvisingStatsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvisingStatsService = TestBed.get(AdvisingStatsService);
    expect(service).toBeTruthy();
  });
});

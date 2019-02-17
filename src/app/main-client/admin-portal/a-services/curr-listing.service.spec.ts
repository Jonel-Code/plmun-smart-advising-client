import { TestBed } from '@angular/core/testing';

import { CurrListingService } from './curr-listing.service';

describe('CurrListingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrListingService = TestBed.get(CurrListingService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SDataUpService } from './s-data-up.service';

describe('SDataUpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SDataUpService = TestBed.get(SDataUpService);
    expect(service).toBeTruthy();
  });
});

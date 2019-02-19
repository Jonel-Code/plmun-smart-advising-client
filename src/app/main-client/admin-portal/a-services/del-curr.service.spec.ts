import { TestBed } from '@angular/core/testing';

import { DelCurrService } from './del-curr.service';

describe('DelCurrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DelCurrService = TestBed.get(DelCurrService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NewCurrService } from './new-curr.service';

describe('NewCurrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewCurrService = TestBed.get(NewCurrService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { IncomingSemService } from './incoming-sem.service';

describe('IncomingSemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomingSemService = TestBed.get(IncomingSemService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { NewFAccService } from './new-f-acc.service';

describe('NewFAccService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewFAccService = TestBed.get(NewFAccService);
    expect(service).toBeTruthy();
  });
});

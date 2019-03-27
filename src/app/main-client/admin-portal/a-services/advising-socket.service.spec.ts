import { TestBed } from '@angular/core/testing';

import { AdvisingSocketService } from './advising-socket.service';

describe('AdvisingSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvisingSocketService = TestBed.get(AdvisingSocketService);
    expect(service).toBeTruthy();
  });
});

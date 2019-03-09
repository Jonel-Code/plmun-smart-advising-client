import { TestBed } from '@angular/core/testing';

import { AdvisingFormService } from './advising-form.service';

describe('AdvisingFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvisingFormService = TestBed.get(AdvisingFormService);
    expect(service).toBeTruthy();
  });
});

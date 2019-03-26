import { TestBed, async, inject } from '@angular/core/testing';

import { CanCreateAccountGuard } from './can-create-account.guard';

describe('CanCreateAccountGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanCreateAccountGuard]
    });
  });

  it('should ...', inject([CanCreateAccountGuard], (guard: CanCreateAccountGuard) => {
    expect(guard).toBeTruthy();
  }));
});

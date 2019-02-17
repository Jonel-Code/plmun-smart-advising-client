import { TestBed, async, inject } from '@angular/core/testing';

import { AdminAccessGuard } from './admin-access.guard';

describe('AdminAccessGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminAccessGuard]
    });
  });

  it('should ...', inject([AdminAccessGuard], (guard: AdminAccessGuard) => {
    expect(guard).toBeTruthy();
  }));
});

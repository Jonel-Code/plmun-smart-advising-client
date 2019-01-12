import { TestBed, async, inject } from '@angular/core/testing';

import { UserAuthenticationGuard } from './user-authentication.guard';

describe('UserAuthenticationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAuthenticationGuard]
    });
  });

  it('should ...', inject([UserAuthenticationGuard], (guard: UserAuthenticationGuard) => {
    expect(guard).toBeTruthy();
  }));
});

import { TestBed, async, inject } from '@angular/core/testing';

import { StudentLoginGuard } from './student-login.guard';

describe('StudentLoginGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentLoginGuard]
    });
  });

  it('should ...', inject([StudentLoginGuard], (guard: StudentLoginGuard) => {
    expect(guard).toBeTruthy();
  }));
});

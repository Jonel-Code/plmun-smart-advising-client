import { TestBed } from '@angular/core/testing';

import { ClusterPostService } from './cluster-post.service';

describe('ClusterPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClusterPostService = TestBed.get(ClusterPostService);
    expect(service).toBeTruthy();
  });
});

import {TestBed} from '@angular/core/testing';

import {DeptListingService} from './dept-listing.service';

describe('DeptListingService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: DeptListingService = TestBed.get(DeptListingService);
        expect(service).toBeTruthy();
    });
});



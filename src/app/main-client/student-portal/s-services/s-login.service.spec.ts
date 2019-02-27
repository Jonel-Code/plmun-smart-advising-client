import {TestBed} from '@angular/core/testing';

import {SLoginService} from './s-login.service';

describe('SLoginService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SLoginService = TestBed.get(SLoginService);
        expect(service).toBeTruthy();
    });
});

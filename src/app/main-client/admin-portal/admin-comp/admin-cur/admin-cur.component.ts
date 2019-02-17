import {Component, OnInit} from '@angular/core';
import {CurrListingService} from '../../a-services/curr-listing.service';
import {CurriculumCardData} from '../admin-parts/curr-card/curr-card.component';
import {ALoginService} from '../../a-services/a-login.service';

@Component({
    selector: 'app-admin-cur',
    templateUrl: './admin-cur.component.html',
    styleUrls: ['./admin-cur.component.css']
})
export class AdminCurComponent implements OnInit {

    dataSet: CurriculumCardData[];

    constructor(private currListingService: CurrListingService,
                private aLoginService: ALoginService) {
        this.dataSet = [];
    }

    ngOnInit() {
        this.loadCurrListing();
    }

    loadCurrListing() {
        const d = this.aLoginService.getUserData();
        const dept = d['department'];
        this.currListingService.getCurriculumOfDepartment(dept)
            .then(x => {
                this.dataSet = [];
                const result = x['result'];
                if (typeof result !== 'undefined') {
                    console.log('result', result);
                    for (const res of result) {
                        const c_data = res['curriculum_data'];
                        console.log('c_data', c_data);
                        for (const _d of c_data) {
                            const cc: CurriculumCardData = {
                                course: _d['course'],
                                year: _d['year'],
                                description: _d['description'],
                                id: _d['curriculum_id']
                            };
                            this.dataSet.push(cc);
                        }
                    }
                }
            });
    }

}

import {Component, OnInit} from '@angular/core';
import {AdminStore} from '../../data-store/admin-store';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

    subject_table: any[];
    student_count: number;

    constructor(private adminStore: AdminStore) {
        this.subject_table = [];
        this.student_count = 0;
    }

    ngOnInit() {
        this.adminStore.load_statistics();
        console.log('adminStore', this.adminStore.admin_data_values);
        this.adminStore.admin_data.subscribe(x => {
            this.subject_table = x.statistics.subjects;
            this.student_count = x.statistics.student_this_sem_count;
        });
    }

}

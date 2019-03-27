import {Component, OnInit} from '@angular/core';
import {AdminStore} from '../../data-store/admin-store';
import {HttpClient} from '@angular/common/http';
import {AdvisingSocketService, IAdvisingEventContext} from '../../a-services/advising-socket.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

    subject_table: any[];
    student_count: number;

    advisingEventContext: IAdvisingEventContext = null;

    constructor(private adminStore: AdminStore, private advisingSocketService: AdvisingSocketService) {
        this.subject_table = [];
        this.student_count = 0;
        this.advisingEventContext = null;
    }

    ngOnInit() {
        this.adminStore.load_statistics();
        console.log('adminStore', this.adminStore.admin_data_values);
        this.adminStore.admin_data.subscribe(x => {
            this.subject_table = x.statistics.subjects;
            this.student_count = x.statistics.student_this_sem_count;
        });
        this.advisingSocketService.getRemovedAddedSocket()
            .subscribe((x: IAdvisingEventContext) => {
                this.advisingEventContext = <IAdvisingEventContext>x;
                if (this.subject_table.length > 0) {
                    for (const item of this.subject_table) {
                        if (x.added.includes(item.code)) {
                            item.count = Number(item.count) + 1;
                        }
                        if (x.removed.includes(item.code)) {
                            if (Number(item.count) > 0) {
                                item.count = Number(item.count) - 1;
                            }
                        }
                    }
                }
                if (x.removed.length === 0) {
                    this.student_count += 1;
                } else {
                    this.student_count -= 1;
                    if (x.added.length > 0) {
                        this.student_count += 1;
                    }
                }
                console.log('from socket', x);
            });

        this.advisingSocketService.get_test_emit()
            .subscribe(x => {
                console.log('test listen', x);
            });
        this.advisingSocketService.get_test_my_event()
            .subscribe(x => {
                console.log('get_test_my_event', x);
            });
    }

    fire_test_emmit() {
        this.advisingSocketService.fire_test_emit();
    }

}

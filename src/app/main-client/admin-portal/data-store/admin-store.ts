import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AdvisingStatsService} from '../a-services/advising-stats.service';

export interface IAdminStore {
    statistics: IAdvisingStats;
}

export interface IAdvisingStats {
    subjects: { code: string, count: number }[];
    student_this_sem_count: number;
}

class AdminStoreData implements IAdminStore {
    statistics: IAdvisingStats;

    constructor() {
        this.statistics = {
            subjects: [],
            student_this_sem_count: 0
        };
    }
}

@Injectable()
export class AdminStore {
    private _admin_data: BehaviorSubject<IAdminStore> = new BehaviorSubject<IAdminStore>(new AdminStoreData());

    readonly admin_data: Observable<IAdminStore> = this._admin_data.asObservable();

    get admin_data_values() {
        return this._admin_data.getValue();
    }

    constructor(private advisingStatsService: AdvisingStatsService) {
    }

    load_statistics() {
        this.advisingStatsService.fetch_statistics()
            .then(data => {
                const sst: any[] = data['statistics'];
                let sdata: { code: string, count: number }[] = [];
                if (Array.isArray(sst)) {
                    sdata = sst.map<{ code: string, count: number }>(x => {
                        return {
                            code: x['code'],
                            count: x['student_count']
                        };
                    });
                }
                const st = this.admin_data_values;
                st.statistics = {
                    subjects: sdata,
                    student_this_sem_count: data['student_this_sem_count']
                };
                this._admin_data.next(st);
            })
            .catch(e => {
                console.log('error', e);
            });
    }
}

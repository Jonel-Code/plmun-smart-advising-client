import {Injectable} from '@angular/core';
import {SGeneralService} from './s-general.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

export interface IOpenSubjectContext {
    year: number;
    semester: string;
    subject_code: string[];
}

@Injectable({
    providedIn: 'root'
})
export class IncomingSemService extends SGeneralService {

    constructor(private _http: HttpClient) {
        super(_http);
    }

    get_available_subjects(args = {}) {
        this._url = `${environment.base_api_url}/open-subject-enhance`;
        return this.doGet(args)
            .then((x) => {
                console.log('get_available_subjects', x);
                return x;
            });
    }

    post_available_subjects(args: IOpenSubjectContext) {
        this._url = `${environment.base_api_url}/open-subject-enhance`;
        console.log('content ', JSON.stringify(args));
        return this.doPost(args)
            .then(x => {
                console.log('post_available_subjects', x);
                return x;
            });
    }

    get_semester_data_list(args = {}) {
        this._url = `${environment.base_api_url}/sem-data-listing`;
        return this.doGet(args)
            .then((x) => {
                console.log('sem-data-listing', x);
                return x;
            });
    }

    delete_semester_data(sem_id) {
        this._url = `${environment.base_api_url}/sem-data-remove`;
        const args = {'sem_id': sem_id};
        console.log('content ', args);
        return this.doPost(args)
            .then(x => {
                console.log('delete_semester_data', x);
                return x;
            });
    }

    activate_semester_data(sem_id) {
        this._url = `${environment.base_api_url}/sem-data-activate`;
        const args = {'sem_id': sem_id};
        console.log('content ', args);
        return this.doPost(args)
            .then(x => {
                console.log('delete_semester_data', x);
                return x;
            });
    }

}

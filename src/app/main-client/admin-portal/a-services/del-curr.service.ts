import {Injectable} from '@angular/core';
import {swal_load} from '../../../helper-scripts/swal-loading';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import swal from 'sweetalert';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DelCurrService {

    private _del_cur_url = `${environment.base_api_url}/curriculum/remove-by-id`;

    constructor(private http: HttpClient) {
    }

    removeCurriculum(curriculum_id: string) {
        swal_load();
        const params = new HttpParams()
            .set('curriculum_id', curriculum_id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        return new Promise(((resolve, reject) => {
            this.http.post(this._del_cur_url, params.toString(), httpOptions)
                .subscribe((response) => {
                    resolve(response['body']);
                }, (err: HttpResponse<any>) => {
                    swal({
                        title: `ERROR: ${err.status} ${err.statusText}`,
                        text: `message: ${err['error']['message']}`
                    });
                    reject(err);
                });
        })).then((r) => {
            swal.close();
            return r;
        }, (rej: HttpResponse<any>) => {
            swal.close();
            return rej;
        });
    }
}

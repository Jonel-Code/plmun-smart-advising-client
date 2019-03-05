import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import swal from 'sweetalert';
import {swal_load} from '../../../helper-scripts/swal-loading';

@Injectable({
    providedIn: 'root'
})
export class SLoginService {

    private _url = `${environment.base_api_url}/new-login`;

    constructor(private http: HttpClient) {
    }

    close_swal() {
        setTimeout(() => {
            swal.close();
        });
    }

    login(u: string, p: string) {
        swal_load();
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: {
                'student_id': u,
                'password': p,
            },
            observe: 'response' as 'body'
        };
        return this.http.get(this._url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise()
            .then((x) => {
                this.close_swal();
                return x;
            }, (z) => {
                this.close_swal();
                return z;
            });
    }

    /*
    * TODO Additional data required for advising
    * 1. status
    * 2. incoming semester (incoming_semester) use uri http://127.0.0.1:5000/open-subject-enhance
    * 2-1. remove suffix for incoming semester
    * 3. course_curriculum revision
    * 3-1. units -> total units
    * 3-2. pre-req array to comma-separated string
    * 3-3. remove suffix for year and semester values
    * 4. subjects taken (subjects_taken)
    * 5. can take subjects (can_take)
    * 6. back subjects (back_subjects)
    * */
}

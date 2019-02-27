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
                swal.close();
                return x;
            }, (z) => {
                swal.close();
                return z;
            });
    }
}

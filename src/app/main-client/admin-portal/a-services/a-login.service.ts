import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ALoginService {

    private _url = `${environment.base_api_url}/admin-login`;

    constructor(private http: HttpClient) {
    }

    adminLogin(fid: string, pass: string) {
        const params = new HttpParams()
            .set('faculty_id', fid)
            .set('password', pass);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this.http.get(this._url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }
}

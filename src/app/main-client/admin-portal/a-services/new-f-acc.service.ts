import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {DepartmentItem} from './dept-listing.service';

@Injectable({
    providedIn: 'root'
})
export class NewFAccService {

    private _url = `${environment.base_api_url}/admin-create`;

    constructor(private http: HttpClient) {
    }

    newAdmin(fid: string, password: string, department: string) {
        const params = new HttpParams()
            .set('faculty_id', fid)
            .set('password', password)
            .set('department', department);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        return this.http.post(this._url, params.toString(), httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }
}

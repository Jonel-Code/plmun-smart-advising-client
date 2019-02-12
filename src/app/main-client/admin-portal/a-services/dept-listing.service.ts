import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

export interface DepartmentItem {
    id: Number;
    title: string;
}

@Injectable({
    providedIn: 'root'
})
export class DeptListingService {

    private _url = `${environment.base_api_url}/all-department`;
    private new_dept_url = `${environment.base_api_url}/new-department`;

    constructor(private http: HttpClient) {
    }

    getDeptList() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        return this.http.get(this._url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }

    newDept(name: string) {
        const params = new HttpParams()
            .set('department_name', name);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        console.log(params);
        console.log(httpOptions);
        return this.http.post(this.new_dept_url, params.toString(), httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }
}

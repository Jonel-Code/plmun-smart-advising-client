import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CurrListingService {
    private _cur_dept_url = `${environment.base_api_url}/department-curriculum`;
    private _curr_data_url = `${environment.base_api_url}/curriculum-data`;

    constructor(private http: HttpClient) {
    }

    getCurriculumOfDepartment(department: string) {
        const params = new HttpParams()
            .set('department', department);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this.http.get(this._cur_dept_url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }

    getCurriculumData(cur_id: string) {
        const params = new HttpParams()
            .set('curriculum_id', cur_id);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this.http.get(this._curr_data_url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }
}

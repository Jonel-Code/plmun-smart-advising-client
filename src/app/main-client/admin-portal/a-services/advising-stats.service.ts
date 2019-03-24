import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdvisingStatsService {
    private _url = `${environment.base_api_url}/advising-stats`;
    constructor(private _http: HttpClient) {
    }

    fetch_statistics() {
        const params = new HttpParams();
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this._http.get(this._url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }
}

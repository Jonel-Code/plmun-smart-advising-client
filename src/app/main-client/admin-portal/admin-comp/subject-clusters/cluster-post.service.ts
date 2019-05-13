import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import swal from 'sweetalert';
import {swal_load} from '../../../../helper-scripts/swal-loading';
import {CustomEncoder} from '../../../../encode-http-params-interceptor';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ClusterPostService {

    private _url = `${environment.base_api_url}/upload-subject-cluster`;

    constructor(private http: HttpClient, private customEncoder: CustomEncoder) {
    }

    get_all() {
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

    upload(data_content: any[]) {
        if (data_content.length === 0) {
            swal({
                title: 'Data is Empty',
                buttons: {
                    Return: true
                }
            });
            return new Promise((resolve, reject) => {
                reject();
            });
        }
        swal_load();
        // url = url;
        console.log('JSON.stringify(data_content)', JSON.stringify(data_content));
        const params = new HttpParams({encoder: new CustomEncoder()})
            .set('content', JSON.stringify(data_content));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        console.log('params', params.toString());
        return new Promise((resolve, reject) => {
            this.http.post(this._url, params.toString(), httpOptions)
                .subscribe((result) => {
                    resolve(result['body']);
                    swal.close();
                }, (err: HttpResponse<any>) => {
                    console.log('err', err);
                    swal.close();
                    swal({
                        title: `HTTP error ${err.status} ${err.statusText}`,
                        text: `message: ${err['error']['message']}`
                    });
                    reject(err);
                });
        });
    }
}

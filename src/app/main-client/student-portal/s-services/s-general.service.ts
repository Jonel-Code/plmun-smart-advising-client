import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {swal_load} from '../../../helper-scripts/swal-loading';


export class SGeneralService {

    protected _url = `${environment.base_api_url}`;

    constructor(public http: HttpClient) {
    }

    private http_options(args) {
        // const params = new HttpParams();
        // Object.keys(args).forEach(x => {
        //     params.set(x, args[x]);
        // });
        console.log('args', args);
        // console.log('params', params);
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body',
            'params': args
        };
    }


    close_swal() {
        setTimeout(() => {
            swal.close();
        });
    }

    doGet(args) {
        const http_option = this.http_options(args);
        // http_option['params'] = params;
        return this.http.get(this._url, http_option)
            .pipe(map(result => {
                swal_load();
                return result;
            }))
            .toPromise()
            .then((x) => {
                // this.close_swal();
                return x;
            }, (z) => {
                // this.close_swal();
                return z;
            });
    }

    doPost(args) {
        // const {http_option, params} = this.http_options(args);
        swal_load();
        const params = new HttpParams()
            .set('content', JSON.stringify(args));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        console.log('params', params);
        return this.http.post(this._url, params.toString(), httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise()
            .then((x) => {
                console.log('post accepted');
                // this.close_swal();
                return x;
            }, (z) => {
                // this.close_swal();
                console.log('post rejected');
                return z;
            });
    }
}

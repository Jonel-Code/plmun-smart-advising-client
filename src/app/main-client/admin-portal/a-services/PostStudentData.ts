import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {swal_load} from '../../../helper-scripts/swal-loading';
import swal from 'sweetalert';

export interface PostStudentData<T> {
    _url: string;
    // content: any[];

}

export class PostStudentData<T> implements PostStudentData<T> {
    _url: string;

    // content: T[];

    constructor(public http: HttpClient) {
    }


    uploadData(data_content: T[]): Promise<any> {
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
        const params = new HttpParams()
            .set('content', JSON.stringify(data_content));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
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

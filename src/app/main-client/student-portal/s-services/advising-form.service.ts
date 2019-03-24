import {Injectable} from '@angular/core';
import {swal_load, swal_close} from '../../../helper-scripts/swal-loading';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

export interface ISaveAdvisingFormContext {
    student_id: number;
    content: number[] | string[];
    semester_id: number;
    is_block_section: boolean;
}

export interface IAdvisingFormContext {
    subject: string;
    units: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdvisingFormService {
    protected _url = `${environment.base_api_url}`;


    constructor(private http: HttpClient) {
    }

    saveAdvisingForm(args: ISaveAdvisingFormContext) {
        // const {http_option, params} = this.http_options(args);
        swal_load('Saving Advising Form');
        const url = this._url + '/save_advising_data';
        const params = new HttpParams()
            .set('student_id', String(args.student_id))
            .set('semester_id', String(args.semester_id))
            .set('content', JSON.stringify(args.content))
            .set('is_block_section', String(args.is_block_section));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        console.log('params', params);
        return this.http.post(url, params.toString(), httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise()
            .then((x) => {
                console.log('post accepted');
                // this.close_swal();
                swal_close();
                return x;
            }, (z) => {
                // this.close_swal();
                console.log('post rejected');
                swal_close();
                return z;
            });
    }

    async getAdvisingFormPDF(student_id, semester_id, args: IAdvisingFormContext[]) {
        swal_load('Generating Advising Form');
        const url = this._url + '/advising_form';
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: {
                'student_id': String(student_id),
                'semester_id': String(semester_id),
                'subjects_content': JSON.stringify(args)
            },
            observe: 'response' as 'body'
        };
        const f = await this.http.get(url, httpOptions)
            .pipe(map(result => {
                return new Blob([result['body']], {type: 'application/pdf'});
            })).toPromise();
        swal_close();
        return f;
        // .then((x) => {
        //     swal_close();
        //     return x;
        // }, (z: HttpResponse<any>) => {
        //     swal_close();
        //     return z;
        // });
    }
}

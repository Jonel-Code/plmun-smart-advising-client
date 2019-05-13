import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import swal from 'sweetalert';
import {swal_load} from '../../../helper-scripts/swal-loading';
import {CustomEncoder} from '../../../encode-http-params-interceptor';

export interface ICurriculumInstance {
    year: string;
    description: string;
    course: string;
    department: string;
}

export interface IBasicSubjectData {
    code: string;
    title: string;
    units: string;
    year: string;
    semester: string;
    pre_req?: string;
}


@Injectable({
    providedIn: 'root'
})
export class NewCurrService {

    private _new_curriculum_url = `${environment.base_api_url}/new-curriculum`;
    private _bulk_subject_url = `${environment.base_api_url}/curriculum/add-bulk-subject`;

    constructor(private http: HttpClient) {
    }

    createCurriculum(curriculum: ICurriculumInstance) {
        swal_load();
        const params = new HttpParams()
            .set('year', curriculum.year)
            .set('description', curriculum.description)
            .set('course', curriculum.course)
            .set('department', curriculum.department);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        return new Promise((resolve, reject) => {
            this.http.post(this._new_curriculum_url, params.toString(), httpOptions)
                .subscribe((result) => {
                    resolve(result['body']);
                }, (err: HttpResponse<any>) => {
                    console.log('createCurriculum err', err);
                    swal({
                        title: `HTTP error ${err.status} ${err.statusText}`,
                        text: `message: ${err['error']['message']}`
                    });
                    reject(err);
                });
        }).then((r) => {
            swal.close();
            return r;
        }, (j) => {
            swal.close();
            return j;
        });
    }

    addSubjectToCurriculum(curriculum_id: string, content: IBasicSubjectData[]) {
        swal_load();
        const data = JSON.stringify(content);
        const params = new HttpParams({encoder: new CustomEncoder()})
            .set('curriculum_id', curriculum_id)
            .set('content', data);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        return new Promise((resolve, reject) => {
            this.http.post(this._bulk_subject_url, params.toString(), httpOptions)
                .subscribe((response) => {
                    resolve(response['body']);
                }, (err: HttpResponse<any>) => {
                    swal({
                        title: `ERROR: ${err.status} ${err.statusText}`,
                        text: `message: ${err['error']['message']}`
                    });
                    reject(err);
                });
        }).then((r) => {
            swal.close();
            return r;
        }, (rej: HttpResponse<any>) => {
            swal.close();
            return rej;
        });
    }

}

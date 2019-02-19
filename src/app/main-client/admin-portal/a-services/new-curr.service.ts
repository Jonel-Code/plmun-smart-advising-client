import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map} from 'rxjs/operators';
import swal from 'sweetalert';

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
        const params = new HttpParams()
            .set('year', curriculum.year)
            .set('description', curriculum.description)
            .set('course', curriculum.department)
            .set('department', curriculum.department);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };
        return new Promise(((resolve, reject) => {
            this.http.post(this._new_curriculum_url, params.toString(), httpOptions)
                .subscribe((result) => {
                    resolve(result);
                }, (err: HttpResponse<any>) => {
                    console.log('createCurriculum err', err);
                    swal({
                        title: `HTTP error ${err.status} ${err.statusText}`,
                        text: `message: ${err['error']['message']}`
                    }).then(() => {
                        reject(err);
                    });
                });
        }));
    }

    addSubjectToCurriculum(curriculum_id: string, content: IBasicSubjectData[]) {
        const data = JSON.stringify(content);
        const params = new HttpParams()
            .set('curriculum_id', curriculum_id)
            .set('content', data);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        return this.http.post(this._bulk_subject_url, params.toString(), httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }

}

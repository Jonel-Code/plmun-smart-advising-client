import {Injectable} from '@angular/core';
import {PostStudentData} from './PostStudentData';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

export interface IDataUpContext {
    student_id: string;
    full_name: string;
    course: string;
    year: string;
}


export interface IGradeUpContext {
    student_id: string;
    subject_code: string;
    grade: number;
}

@Injectable({
    providedIn: 'root'
})
export class SDataUpService<T = IDataUpContext> extends PostStudentData<T> {
    constructor(private _http: HttpClient) {
        super(_http);
        this._url = `${environment.base_api_url}/student/upload-data`;
    }

    // setContent<T = IDataUpContext>(c: T[]) {
    //     super.setContent(c);
    // }
}

@Injectable({
    providedIn: 'root'
})
export class SGradeUpService<T = IGradeUpContext> extends PostStudentData<T> {
    constructor(private _http: HttpClient) {
        super(_http);
        this._url = `${environment.base_api_url}/student/upload-grade`;
    }

    // setContent<T = IDataUpContext>(c: T[]) {
    //     super.setContent(c);
    // }
}

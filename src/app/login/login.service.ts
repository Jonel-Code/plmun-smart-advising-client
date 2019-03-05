import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {RoutingPaths} from '../core/app-routing/routingPaths';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {SStore} from '../main-client/student-portal/s-services/s-store';
import swal from 'sweetalert';

export interface ISubjectEdgesDataset {
    edges: ISubjectEdge[];
    nodes: ISubjectNodes[];
}

export interface ISubjectEdge {
    parent: string;
    child: string;
}

export interface ISubjectNodes {
    id: string;
    label: string;
    color: string;
    title: string;
}


export enum StudentStatusEnum {
    regular = 'regular',
    irregular = 'irregular',
}

export interface ISubject {
    code: string;
    title: string;
    total_units: number;
    pre_req: string;
    year: string;
    semester: string;
}

export interface ISubjectGrade {
    code: string;
    grade: number;
}

export interface ICourseCurriculum {
    course: string;
    year: string;
    subjects: ISubject[];
    // paths: ISubjectEdgesDataset;
}

export interface IStudentInformation {
    name: string;
    id: string;
    course: string;
    year: string;
    status: StudentStatusEnum;
    course_curriculum: ICourseCurriculum;
    subjects_taken: ISubjectGrade[];
    can_take: string[];
    back_subjects: string[];
    incoming_semester: string;
}

@Injectable()
export class LoginService {

    private loginToken = 'LoginToken';
    private studentToken = 'studentToken';
    private userTypeToken = 'uType';
    private usernameToken = 'username';
    appRoutes = new RoutingPaths();
    private login_url = `${environment.base_api_url}/login`;
    // private user_url = `${environment.base_api_url}/users`;
    // private register_url = `${environment.base_api_url}/registration`;

    constructor(private router: Router,
                private http: HttpClient,
                public sStore: SStore) {
    }

    getUsernameToken() {
        return localStorage.getItem(this.usernameToken);
    }

    // sendUsernameToken(value: string) {
    //     localStorage.setItem(this.usernameToken, value);
    // }
    //
    // sendUTypeToken(token: string) {
    //     localStorage.setItem(this.userTypeToken, token);
    // }

    getUTypeToken() {
        return localStorage.getItem(this.userTypeToken);
    }

    // sendToken(token: string) {
    //     localStorage.setItem(this.loginToken, token);
    // }

    getToken() {
        return localStorage.getItem(this.loginToken);
    }

    getStudentToken() {
        return localStorage.getItem(this.studentToken);
    }

    setStudentToken(val: any) {
        console.log('set student token', val);
        localStorage.setItem(this.studentToken, btoa(JSON.stringify(val)));
    }

    isLogin() {
        return this.getToken() !== null;
    }

    logout() {
        localStorage.removeItem(this.loginToken);
        localStorage.removeItem(this.userTypeToken);
        localStorage.removeItem(this.studentToken);
        this.router.navigate([this.appRoutes.RoutingPaths.login]);
    }

    loginErrorMessage() {
        setTimeout(() => {
            swal({
                title: 'Error in Http',
                buttons: {Return: true}
            });
        });
    }

    close_swal_messages() {
        setTimeout(() => {
            swal.close();
        });
    }

    login(username: string, password: string) {
        return this.sStore.load_student_data(username, password)
            .then(x => {
                return x;
            }, x => {
                // this.loginErrorMessage();
                return x;
            });
        // const params = new HttpParams()
        //     .set('student_id', username)
        //     .set('password', password);
        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     })
        // };
        // console.log(params);
        // console.log(httpOptions);
        // return this.http.post(this.login_url, params.toString(), httpOptions)
        //     .pipe(map(result => {
        //         return result;
        //     }));
    }

    isStudentLoggedIn() {
        return this.getStudentToken() !== null;
    }

    // register(username: string, password: string) {
    //     const params = new HttpParams()
    //         .set('username', username)
    //         .set('password', password)
    //         .set('type', '1');
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         })
    //     };
    //     console.log(params);
    //     console.log(httpOptions);
    //     return this.http.post(this.register_url, params.toString(), httpOptions)
    //         .pipe(map(result => result));
    // }

    // getUsers() {
    //     console.log(this.getToken());
    //     const httpOptions = {
    //         headers: new HttpHeaders({
    //             'Authorization': `Bearer ${this.getToken()}`
    //         })
    //     };
    //     return this.http.get(this.user_url, httpOptions)
    //         .pipe(map(result => result));
    // }
}

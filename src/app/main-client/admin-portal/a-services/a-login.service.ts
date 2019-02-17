import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ALoginService {

    private _url = `${environment.base_api_url}/admin-login`;
    private _special_separator = ',';
    private _login_info = 'lif';
    private _user_info = 'uif';

    constructor(private http: HttpClient,
                private router: Router) {
    }

    clearLoginData() {
        localStorage.clear();
    }

    saveLoginData(u: string, p: string) {
        localStorage.setItem(this._login_info, btoa(u + this._special_separator + p));
    }

    saveUserData(data: any) {
        localStorage.setItem(this._user_info, btoa(JSON.stringify(data)));
    }

    getUserData() {
        const x = localStorage.getItem(this._user_info);
        if (typeof x === 'undefined') {
            return null;
        }
        return JSON.parse(atob(x));
    }

    getLoginData(): string[] {
        const x = localStorage.getItem(this._login_info);
        if (typeof x === 'undefined') {
            return [];
        }
        return atob(x).split(this._special_separator);
    }

    adminLogin(fid: string, pass: string) {
        const params = new HttpParams()
            .set('faculty_id', fid)
            .set('password', pass);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this.http.get(this._url, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise()
            .then(d => {
                if (typeof d['account_data'] !== 'undefined') {
                    this.saveLoginData(fid, pass);
                    this.saveUserData(d['account_data']);
                }
                return d;
            });
    }

    toLogin() {
        this.router.navigate(['admin-login']);
    }
}

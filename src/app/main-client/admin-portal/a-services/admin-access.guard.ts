import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {ALoginService} from './a-login.service';

@Injectable({
    providedIn: 'root'
})
export class AdminAccessGuard implements CanActivate {
    constructor(private aLoginService: ALoginService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const info = this.aLoginService.getLoginData();
        if (info.length <= 0) {
            return false;
        }
        return this.aLoginService.adminLogin(info[0], info[1])
            .then(d => {
                const a_data = d['account_data'];
                const r = (typeof a_data !== 'undefined');
                if (!r) {
                    this.aLoginService.toLogin();
                }
                return r;
            });
    }


}

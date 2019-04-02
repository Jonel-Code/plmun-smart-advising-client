import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ALoginService} from './a-login.service';

@Injectable({
    providedIn: 'root'
})
export class CanCreateAccountGuard implements CanActivate {
    constructor(private aLoginService: ALoginService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const x = this.aLoginService.getUserData();
        const rv = x['account_type'] === 'Admin';
        if (!rv) {
            this.router.navigate(['student-login']);
        }
        return rv;
    }


    can_create(): boolean {
        const x = this.aLoginService.getUserData();
        console.log('ccx', x);
        return x['account_type'] === 'Admin';
    }
}

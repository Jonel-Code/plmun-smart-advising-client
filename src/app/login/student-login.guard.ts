import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from './login.service';
import {RoutingPaths} from '../core/app-routing/routingPaths';
import {SStore} from '../main-client/student-portal/s-services/s-store';

@Injectable({
    providedIn: 'root'
})
export class StudentLoginGuard implements CanActivate {

    private routing: RoutingPaths = new RoutingPaths();
    private is_logged_in = false;

    constructor(private loginService: LoginService,
                private router: Router,
                private sStore: SStore) {
        this.load_guard_subs();
    }

    private load_guard_subs() {
        this.sStore.student_data
            .subscribe(value => {
                this.is_logged_in = value.id.length > 0 && value.name.length > 0;
            });
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // if (this.loginService.isStudentLoggedIn()) {
        //     return true;
        // }
        return this.sStore.is_authenticated()
            .then(x => {
                if (!x) {
                    this.router.navigate(['student-login']);
                }
                return x;
            }, x => {
                return x;
            });
        // if (this.is_logged_in) {
        //     return true;
        // }
        //
        // // console.log('!this.loginService.isStudentLoggedIn()', !this.loginService.isStudentLoggedIn());
        // return false;
    }
}

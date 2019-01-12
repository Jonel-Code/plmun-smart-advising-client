import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from './login.service';
import {RoutingPaths} from '../core/app-routing/routingPaths';

@Injectable({
    providedIn: 'root'
})
export class StudentLoginGuard implements CanActivate {

    private routing: RoutingPaths = new RoutingPaths();

    constructor(private loginService: LoginService,
                private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.loginService.isStudentLoggedIn()) {
            return true;
        }
        this.router.navigate(['student-login']);
        // console.log('!this.loginService.isStudentLoggedIn()', !this.loginService.isStudentLoggedIn());
        return false;
    }
}

import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from './login/login.service';
import {RoutingPaths} from './core/app-routing/routingPaths';

@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationGuard implements CanActivate {
  appRouting: RoutingPaths = new RoutingPaths();
  constructor(private loginService: LoginService,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginService.isLogin()) {
      return true;
    } else {
      this.router.navigate([this.appRouting.RoutingPaths.login]);
      return false;
    }
  }
}

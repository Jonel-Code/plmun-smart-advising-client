import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

    @ViewChild('uname') uname: ElementRef;
    @ViewChild('pass') pass: ElementRef;

    get uname_value(): string {
        return this.uname.nativeElement.value.toString().trim();
    }

    get pass_value(): string {
        return this.pass.nativeElement.value.toString().trim();
    }

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    admin_login() {
        if (!this.has_valid_inputs()) {
            return;
        }
        // call login then render login authentication result
        this.redirect_to_dashboard();
    }

    redirect_to_dashboard() {
        this.router.navigate(['admin/main']);
    }


    has_valid_inputs() {
        return this.uname_value !== ''
            && this.pass_value !== ''
            && this.is_empty_string(this.uname_value)
            && this.is_empty_string(this.pass_value);
    }

    is_empty_string(str: string) {
        return /\S/.test(str);
    }
}


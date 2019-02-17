import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ALoginService} from '../main-client/admin-portal/a-services/a-login.service';
import swal from 'sweetalert';

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

    constructor(private router: Router,
                private aLoginService: ALoginService) {
    }

    ngOnInit() {
    }

    admin_login() {
        if (!this.has_valid_inputs()) {
            return;
        }

        swal({
            text: 'Login using this account?',
            icon: 'info',
            buttons: {
                Yes: true,
                Cancel: true,
            }
        }).then(x => {
            switch (x) {
                case 'Yes':
                    return this.login_user();
                case 'Cancel':
                    break;
                default:

            }
        }).then(d => {
            const a_data = d['account_data'];
            if (typeof a_data !== 'undefined') {
                this.redirect_to_dashboard();
            } else {
                swal({
                    title: 'Wrong Username and Password',
                    buttons: {
                        Return: true
                    },
                    icon: 'error',
                });
            }
        });


        // call login then render login authentication result
    }

    login_user() {
        return this.aLoginService.adminLogin(this.uname_value, this.pass_value);
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


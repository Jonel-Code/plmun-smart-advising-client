import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ICourseCurriculum, IStudentInformation, ISubject, ISubjectGrade, LoginService, StudentStatusEnum} from './login.service';
// import {Routings} from '../core/app-routing/app-routing.module';
// import {routePaths} from '../core/app-routing/app-routing.module';
import {RoutingPaths} from '../core/app-routing/routingPaths';
import swal from 'sweetalert';
import {HttpResponse} from '@angular/common/http';
import {swal_close, swal_load} from '../helper-scripts/swal-loading';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    form: FormGroup;
    private routePaths: RoutingPaths = new RoutingPaths();

    constructor(private router: Router,
                private fbuilder: FormBuilder,
                private loginService: LoginService) {
        this.form = fbuilder.group({
            studentId: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    studentId: string;
    password: string;
    sending: boolean;

    ngOnInit() {
        this.loginService.logout();
        this.sending = false;
    }

    login() {
        swal_load();
        // console.log(this.appRouting.RoutingPaths.home);
        this.loginService.logout();
        this.sending = true;
        this.loginService.login(this.form.value.studentId, this.form.value.password)
            .then((data) => {
                swal_close();
                console.log('response data', data);
                this.sending = false;
                this.router.navigate(['/home']);
            })
            .catch((x: HttpResponse<any>) => {
                swal_close();
                swal({
                    text: 'Account not found',
                    icon: 'warning',
                    buttons: {
                        'Return': true
                    }
                }).then(y => {
                    this.router.navigate(['/student-login']);
                    this.sending = false;
                });
                return x;
            });
    }

}


// , (e) => {
//                     console.log('LOGIN error', e);
//                     this.sending = false;
//                     reject(e);
//                     if (e['status'] === 404) {
//                         swal({
//                             text: 'Account not found',
//                             icon: 'warning',
//                             buttons: {
//                                 'Return': true
//                             }
//                         });
//                     }
//                 }
// try {
//
// } catch (e) {
//
// } finally {
//     this.sending = false;
// }


// const self = this;
// p.then((data) => {
//     console.log(data);
//     const status: StudentStatusEnum = (String(data['status']).toLowerCase() === 'regular')
//         ? StudentStatusEnum.regular : StudentStatusEnum.irregular;
//     const subjs: ISubject[] = [];
//     const raw_course_cur = data['course_curriculum'];
//     const subject_paths = raw_course_cur['paths'];
//     console.log('subject_paths:', subject_paths);
//     for (const i of raw_course_cur['subjects']) {
//         console.log(i);
//         let pre_req_arr = i['pre_req'];
//         if (Array.isArray(pre_req_arr)) {
//             pre_req_arr = pre_req_arr.join(',');
//         }
//         subjs.push({
//             code: i['code'],
//             title: i['title'],
//             total_units: Number(i['total_units']),
//             pre_req: pre_req_arr,
//             year: i['year'],
//             semester: i['semester']
//         });
//     }
//     console.log('subjs', subjs);
//     console.log('status', status);
//     const course_curriculum: ICourseCurriculum = {
//         course: raw_course_cur['course'],
//         year: raw_course_cur['year'],
//         subjects: subjs,
//         // paths: subject_paths
//     };
//     const subjects_taken: ISubjectGrade[] = [];
//     for (const i of data['subjects_taken']) {
//         console.log(i);
//         subjects_taken.push({
//             code: i['code'],
//             grade: Number(i['grade'])
//         });
//     }
//     const studInfo: IStudentInformation = {
//         name: data['name'],
//         id: data['id'],
//         course: data['course'],
//         year: data['year'],
//         status: status,
//         course_curriculum: course_curriculum,
//         subjects_taken: subjects_taken,
//         can_take: data['can_take'],
//         back_subjects: data['back_subjects'],
//         incoming_semester: data['incoming_semester']
//     };
//     self.loginService.setStudentToken(studInfo);
//     console.log('student info', self.loginService.getStudentToken());
//     const req_token = atob(self.loginService.getStudentToken());
//     const req_json = JSON.parse(req_token);
//     const r_message = `name: ${req_json.name}\nstudent ID: ${req_json.id}\ncourse: ${req_json.course}`;
//     swal({
//         title: 'Data received',
//         text: r_message,
//         buttons: {
//             OKAY: true
//         }
//     }).then(d => {
//         self.router.navigate([self.routePaths.RoutingPaths.home]);
//     });
// });

// const self = this;
// const x = setInterval(function () {
//     console.log(`student_id: ${self.form.value.studentId} password: ${self.form.value.password}`);
//     if (self.form.valid) {
//         self.loginService.login(self.form.value.studentId, self.form.value.password)
//             .subscribe(
//                 data => {
//
//                     // self.loginService.sendToken(data['access_token']);
//                     // self.loginService.sendUTypeToken(data['type']);
//                     // self.loginService.sendUsernameToken(data['username']);
//                     // if (data['type'] === 0) {
//                     //     self.router.navigate([self.routePaths.RoutingPaths.adminDashboard]);
//                     // } else {
//                     //     self.router.navigate([self.routePaths.RoutingPaths.home]);
//                     // }
//                     // console.log(self.loginService.getToken());
//                 }, err => {
//                     console.log(err);
//                     alert(err['error']['message']);
//                 }
//             );
//         // const get_users = self.loginService.getUsers()
//         //   .subscribe(
//         //     data => {
//         //       console.log(data);
//         //     }
//         //   );
//     } else {
//         alert('INVALID AUTHENTICATIONS');
//     }
//     self.sending = false;
//     clearInterval(x);
// }, 1500);


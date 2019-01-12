import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ICourseCurriculum, IStudentInformation, ISubject, ISubjectGrade, LoginService, StudentStatusEnum} from './login.service';
// import {Routings} from '../core/app-routing/app-routing.module';
// import {routePaths} from '../core/app-routing/app-routing.module';
import {RoutingPaths} from '../core/app-routing/routingPaths';

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

    login(): boolean {
        // console.log(this.appRouting.RoutingPaths.home);
        this.loginService.logout();
        this.sending = true;
        const self = this;
        const x = setInterval(function () {
            console.log(`student_id: ${self.form.value.studentId} password: ${self.form.value.password}`);
            if (self.form.valid) {
                self.loginService.login(self.form.value.studentId, self.form.value.password)
                    .subscribe(
                        data => {
                            console.log(data);
                            const status: StudentStatusEnum = (data['status'] === 'regular')
                                ? StudentStatusEnum.regular : StudentStatusEnum.irregular;
                            const subjs: ISubject[] = [];
                            const raw_course_cur = data['course_curriculum'];
                            const subject_paths = raw_course_cur['paths'];
                            console.log('subject_paths:', subject_paths );
                            for (const i of raw_course_cur['subjects']) {
                                console.log(i);
                                subjs.push({
                                    code: i['code'],
                                    title: i['title'],
                                    total_units: Number(i['total_units']),
                                    pre_req: i['pre_req'],
                                    year: i['year'],
                                    semester: i['semester']
                                });
                            }
                            const course_curriculum: ICourseCurriculum = {
                                course: raw_course_cur['course'],
                                year: raw_course_cur['year'],
                                subjects: subjs,
                                paths: subject_paths
                            };
                            const subjects_taken: ISubjectGrade[] = [];
                            for (const i of data['subjects_taken']) {
                                console.log(i);
                                subjects_taken.push({
                                    code: i['code'],
                                    grade: Number(i['grade'])
                                });
                            }
                            const studInfo: IStudentInformation = {
                                name: data['name'],
                                id: data['id'],
                                course: data['course'],
                                year: data['year'],
                                status: status,
                                course_curriculum: course_curriculum,
                                subjects_taken: subjects_taken,
                                can_take: data['can_take'],
                                back_subjects: data['back_subjects'],
                                incoming_semester: data['incoming_semester']
                            };
                            self.loginService.setStudentToken(studInfo);
                            console.log('student info', self.loginService.getStudentToken());
                            const req_token = atob(self.loginService.getStudentToken());
                            const req_json = JSON.parse(req_token);
                            alert(`data received: \nname: ${req_json.name}\nstudent ID: ${req_json.id}\ncourse: ${req_json.course}`);
                            self.router.navigate([self.routePaths.RoutingPaths.home]);
                            // self.loginService.sendToken(data['access_token']);
                            // self.loginService.sendUTypeToken(data['type']);
                            // self.loginService.sendUsernameToken(data['username']);
                            // if (data['type'] === 0) {
                            //     self.router.navigate([self.routePaths.RoutingPaths.adminDashboard]);
                            // } else {
                            //     self.router.navigate([self.routePaths.RoutingPaths.home]);
                            // }
                            // console.log(self.loginService.getToken());
                        }, err => {
                            console.log(err);
                            alert(err['error']['message']);
                        }
                    );
                // const get_users = self.loginService.getUsers()
                //   .subscribe(
                //     data => {
                //       console.log(data);
                //     }
                //   );
            } else {
                alert('INVALID AUTHENTICATIONS');
            }
            self.sending = false;
            clearInterval(x);
        }, 1500);
        return false;
    }

}

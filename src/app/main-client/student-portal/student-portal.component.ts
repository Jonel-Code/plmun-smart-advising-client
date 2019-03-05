import {Component, OnInit} from '@angular/core';
import {LoginService, StudentStatusEnum} from '../../login/login.service';
import {SStore} from './s-services/s-store';

export enum StudentPortalMenuEnum {
    STATUS, ADVISING
}

@Component({
    selector: 'app-student-portal',
    templateUrl: './student-portal.component.html',
    styleUrls: ['./student-portal.component.css']
})
export class StudentPortalComponent implements OnInit {
    name: string;
    id: string;
    course: string;
    year: string;
    status: StudentStatusEnum;
    incoming_semester: string;
    mainMenu;

    student_name: string;

    constructor(private loginService: LoginService,
                public sStore: SStore) {
    }

    changeMenu(selectMenu: number) {
        this.mainMenu = StudentPortalMenuEnum[selectMenu];
    }

    ngOnInit() {
        this.changeMenu(0);
        // const data_source = JSON.parse(atob(this.loginService.getStudentToken()));
        // this.name = data_source.name;
        // this.id = data_source.id;
        // this.course = data_source.course;
        // this.year = data_source.year;
        // this.status = data_source.status;
        // this.incoming_semester = data_source.incoming_semester;


        this.load_student_data();
        // console.log('data_source', data_source);
    }

    load_student_data() {
        // this.student_name = this.sStore.student_data_values.name;
        // console.log('first value', this.student_name);
        // this.sStore.set_name('jonel pante');
        // console.log('student data store', this.sStore.student_data);
        // console.log('student_data_values', this.sStore.student_data_values);
        // this.student_name = this.sStore.student_data_values.name;
        // console.log('last value', this.student_name);
        this.sStore.load_student_data('16118083', 'jonel pante');
    }

}

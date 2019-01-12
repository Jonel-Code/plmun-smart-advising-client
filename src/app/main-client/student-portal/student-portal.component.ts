import {Component, OnInit} from '@angular/core';
import {LoginService, StudentStatusEnum} from '../../login/login.service';

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

    constructor(private loginService: LoginService) {
    }

    changeMenu(selectMenu: number) {
        this.mainMenu = StudentPortalMenuEnum[selectMenu];
    }

    ngOnInit() {
        this.changeMenu(0);
        const data_source = JSON.parse(atob(this.loginService.getStudentToken()));
        this.name = data_source.name;
        this.id = data_source.id;
        this.course = data_source.course;
        this.year = data_source.year;
        this.status = data_source.status;
        this.incoming_semester = data_source.incoming_semester;
    }


}

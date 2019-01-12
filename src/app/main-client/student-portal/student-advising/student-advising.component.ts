import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {IStudentInformation, ISubject, LoginService, StudentStatusEnum} from '../../../login/login.service';
import {SelectionModel} from '@angular/cdk/collections';
import {AdvisingFormComponent, IBasicStudentInformation} from '../main-components/advising-form/advising-form.component';

@Component({
    selector: 'app-student-advising',
    templateUrl: './student-advising.component.html',
    styleUrls: ['./student-advising.component.css']
})
export class StudentAdvisingComponent implements OnInit {

    displayedColumns: string[] = ['code', 'title', 'total_units', 'pre_req', 'year', 'semester', 'add'];
    tableData: MatTableDataSource<ISubject>;
    student_years: string[] = ['first', 'second', 'third', 'fourth'];
    @ViewChild(MatSort) sort: MatSort;
    lockSelection = false;
    selection = new SelectionModel<ISubject>(true, []);
    status: StudentStatusEnum;

    student_info: IBasicStudentInformation;
    incoming_semester: string;

    maxUnits: number;

    constructor(private loginService: LoginService,
                public dialog: MatDialog) {
        const _tableData: ISubject[] = [];
        const data_source: MatTableDataSource<IStudentInformation> = JSON.parse(atob(this.loginService.getStudentToken()));
        const course_curriculum = data_source['course_curriculum'];
        const subjects = course_curriculum['subjects'];
        const can_take: string[] = data_source['can_take'];
        this.status = data_source['status'];
        console.log('can_take', can_take);
        for (const i of subjects) {
            if (can_take.includes(i.code)) {
                console.log(i.title);
                _tableData.push({
                    code: i.code,
                    title: i.title,
                    total_units: i.total_units,
                    pre_req: i.pre_req,
                    year: (this.student_years.indexOf(i.year) + 1).toString(),
                    semester: i.semester
                });
            }
        }
        this.tableData = new MatTableDataSource(_tableData);
        this.student_info = {
            name: data_source['name'],
            id: data_source['id'],
            course: data_source['course'],
            status: data_source['status'],
            year: data_source['year']
        };
        this.incoming_semester = data_source['incoming_semester'];
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tableData.data.length;
        return numSelected === numRows;
    }

    haveSelected() {
        return this.selection.hasValue();
    }

    masterToggle() {
        if (!this.lockSelection) {
            this.haveSelected() ?
                this.selection.clear() :
                this.tableData.data.forEach(row => {
                    if (!this.isUnitExceed()) {
                        this.selection.toggle(row);
                    }
                });
        }
    }

    singleToggle(row) {
        console.log('using row:', row);
        if (!this.isUnitExceed()) {
            this.selection.toggle(row);
        }
        console.log('this.selection', this.selection);
    }

    inSelection($event, row) {
        return this.selection.isSelected(row);
    }

    // selectionToggle(row: ISubject) {
    //     this.selection.toggle(row);
    //     let counter = 23;
    //     this.tableData.data.forEach(item => {
    //         counter -= (this.selection.selected.includes(item)) ? item.total_units : 0;
    //     });
    //     this.remainingUnits = counter;
    // }

    remainigUnits() {
        let counter = this.maxUnits;
        this.selection.selected.forEach(item => {
            counter -= (this.selection.selected.includes(item)) ? item.total_units : 0;
        });

        return counter;
    }

    isUnitExceed(unit_val = 2) {
        return this.remainigUnits() - unit_val < 0;
    }

    nullFunction() {
        console.log('null function is fired');
    }

    openDialog() {
        this.dialog.open(AdvisingFormComponent, {
            data: {
                subjects: this.selection.selected,
                student: this.student_info,
                incoming_semester: this.incoming_semester
            }
        });
    }

    ngOnInit() {
        this.tableData.sort = this.sort;
        this.lockSelection = (this.status.toString() === 'regular');
        this.maxUnits = 23;
        // this.lockSelection = true;
        if (this.lockSelection) {
            this.tableData.data.forEach(row => this.selection.select(row));
        }
    }
}

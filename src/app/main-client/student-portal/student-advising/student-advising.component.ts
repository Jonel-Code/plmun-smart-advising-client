import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {ISubject, LoginService, StudentStatusEnum} from '../../../login/login.service';
import {SelectionModel} from '@angular/cdk/collections';
import {AdvisingFormComponent, IBasicStudentInformation} from '../main-components/advising-form/advising-form.component';
import {EStudentStatus, IStudentStore, SStore} from '../s-services/s-store';
import {AdvisingFormService, IAdvisingFormContext, ISaveAdvisingFormContext} from '../s-services/advising-form.service';
import {AdvisingSocketService} from '../../admin-portal/a-services/advising-socket.service';

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
    status: EStudentStatus;

    student_info: IBasicStudentInformation;
    incoming_semester: string;

    maxUnits: number;

    _data_2_send: any = null;

    @ViewChild('advisingPrint') advisingPrint;

    constructor(private loginService: LoginService,
                public dialog: MatDialog,
                private sStore: SStore,
                private advisingFormService: AdvisingFormService,
                private advisingSocketService: AdvisingSocketService) {
        // const _tableData: ISubject[] = [];
        // const data_source: MatTableDataSource<IStudentInformation> = JSON.parse(atob(this.loginService.getStudentToken()));
        // const course_curriculum = data_source['course_curriculum'];
        // const subjects = course_curriculum['subjects'];
        // const can_take: string[] = data_source['can_take'];
        // this.status = data_source['status'];
        // console.log('can_take', can_take);
        // for (const i of subjects) {
        //     if (can_take.includes(i.code)) {
        //         console.log(i.title);
        //         _tableData.push({
        //             code: i.code,
        //             title: i.title,
        //             total_units: i.total_units,
        //             pre_req: i.pre_req,
        //             year: (this.student_years.indexOf(i.year) + 1).toString(),
        //             semester: i.semester
        //         });
        //     }
        // }
        this.tableData = new MatTableDataSource([]);
        // this.student_info = {
        //     name: data_source['name'],
        //     id: data_source['id'],
        //     course: data_source['course'],
        //     status: data_source['status'],
        //     year: data_source['year']
        // };
        // this.incoming_semester = data_source['incoming_semester'];
        this.load_main_content();
    }

    load_main_content() {
        this.sStore.student_data
            .subscribe(value => {
                console.log('value', value);
                // if (!value.can_take_this_semester || !value.course_curriculum.subjects) {
                //     return;
                // }
                // const _tableData: ISubject[] = [];
                // for (const i of value.course_curriculum.subjects) {
                //     if (value.can_take_this_semester.includes(i.code.toLowerCase())) {
                //         _tableData.push({
                //             code: i.code.toLowerCase(),
                //             title: i.title,
                //             total_units: Number(i.total_units),
                //             pre_req: i.pre_req.join(','),
                //             year: (this.student_years.indexOf(i.year.toString().toLowerCase())).toString(),
                //             semester: i.semester
                //         });
                //     }
                // }
                // this.tableData.data = _tableData;
                this.student_info = {
                    name: value.name,
                    id: value.id,
                    course: value.course,
                    status: StudentStatusEnum[value.status.toString().toLowerCase()],
                    year: value.year.toString()
                };
                if (this.is_student_regular()) {
                    this.load_regular_subj(value);
                } else {
                    this.load_irregular_subj(value);
                }
                console.log('this.student_info', this.student_info);
            });
    }

    load_regular_subj(value: IStudentStore) {
        console.log('value', value);
        if (!value.incoming_semester || !value.year || !value.course_curriculum.subjects) {
            return;
        }
        const _tableData: ISubject[] = [];
        for (const i of value.course_curriculum.subjects) {
            if (i.semester === value.incoming_semester.semester && i.year === value.year) {
                _tableData.push({
                    code: i.code.toLowerCase(),
                    title: i.title,
                    total_units: Number(i.total_units),
                    pre_req: i.pre_req.join(','),
                    year: (this.student_years.indexOf(i.year.toString().toLowerCase())).toString(),
                    semester: i.semester
                });
            }
            // if (value.can_take_this_semester.includes(i.code.toLowerCase())) {
            //     _tableData.push({
            //         code: i.code.toLowerCase(),
            //         title: i.title,
            //         total_units: Number(i.total_units),
            //         pre_req: i.pre_req.join(','),
            //         year: (this.student_years.indexOf(i.year.toString().toLowerCase())).toString(),
            //         semester: i.semester
            //     });
            // }
        }
        console.log('regular_subj', _tableData);
        this.tableData.data = _tableData;
        const rs = this.sStore.get_regular_subjecst();
        console.log('reg subj', rs);
    }

    load_irregular_subj(value: IStudentStore) {
        console.log('value', value);
        if (!value.can_take_this_semester || !value.course_curriculum.subjects) {
            return;
        }
        const _tableData: ISubject[] = [];
        for (const i of value.course_curriculum.subjects) {
            if (value.can_take_this_semester.includes(i.code.toLowerCase())) {
                _tableData.push({
                    code: i.code.toLowerCase(),
                    title: i.title,
                    total_units: Number(i.total_units),
                    pre_req: i.pre_req.join(','),
                    year: (this.student_years.indexOf(i.year.toString().toLowerCase())).toString(),
                    semester: i.semester
                });
            }
        }
        this.tableData.data = _tableData;
    }

    year_index_2_string(i_x: string) {
        return this.student_years[Number(i_x)];
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
                    if (!this.isUnitExceed(row.total_units)) {
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


    openDialog() {
        this.dialog.open(AdvisingFormComponent, {
            height: 'auto',
            width: 'auto',
            data: {
                subjects: this.selection.selected,
                student: this.student_info,
                incoming_semester: this.incoming_semester
            }
        });
    }

    submit_advising_form() {
        this._data_2_send = null;
        const is_section_block = this.sStore.student_data_values.status === EStudentStatus.REGULAR;
        let to_send_ids: any[] = [];
        const selected_items = this.selection.selected.map(x => {
            return x.code.toLowerCase();
        });
        console.log('selected_items', selected_items);
        const av_subs = this.sStore.student_data_values.incoming_semester.subjects_items;
        if (is_section_block) {
            to_send_ids = selected_items.slice().map(x => String(x).toLowerCase());
        } else {
            for (const a of av_subs) {
                if (selected_items.includes(a.code.toLowerCase())) {
                    const to_add: number = Number(a.id);
                    to_send_ids.push(to_add);
                }
            }
        }

        console.log('to_send_ids', to_send_ids);
        // return ;
        const s_id = this.sStore.student_data_values.incoming_semester.semester_id;
        const data_2_send: ISaveAdvisingFormContext = {
            student_id: Number(this.sStore.student_data_values.id),
            content: to_send_ids,
            semester_id: s_id,
            is_block_section: is_section_block
        };
        console.log('data_2_send', data_2_send);
        this.advisingFormService.saveAdvisingForm(data_2_send)
            .then(x => {
                console.log('submit_advising_form', x);
                if (x['body']['data'] !== undefined) {
                    this._data_2_send = x['body']['data'];
                    this.advisingSocketService.emit_advising_form(this._data_2_send)
                        .then(y => {
                            console.log('emit_advising_form', y);
                        });
                }
                this.start_print_advising_form();
            });
    }

    start_print_advising_form() {
        const p = this.new_print_advising();
        // p.then(x => {
        //
        // });
    }

    async new_print_advising() {
        const sid = this.sStore.student_data_values.id;
        const sem_id = this.sStore.student_data_values.incoming_semester.semester_id;
        const print_data: IAdvisingFormContext[] = [];
        for (const s of this.selection.selected) {
            print_data.push({
                subject: s.title,
                units: s.total_units
            });
        }
        const pdf = await this.advisingFormService.getAdvisingFormPDF(sid, sem_id, print_data);
        const ur = window.URL.createObjectURL(pdf);
        // window.open(ur);
        const lk = this.advisingPrint.nativeElement;
        lk.href = ur;
        lk.download = 'advising_form.pdf';
        lk.click();
        window.URL.revokeObjectURL(ur);
    }

    ngOnInit() {
        this.tableData.sort = this.sort;
        this.lockSelection = this.is_student_regular();
        this.maxUnits = 23;
        // this.lockSelection = true;
        if (this.lockSelection) {
            this.tableData.data.forEach(row => this.selection.select(row));
        }
    }

    is_student_regular() {
        return (this.student_info.status === StudentStatusEnum.regular);
    }
}

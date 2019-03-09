import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {IncomingSemService, IOpenSubjectContext} from '../../../student-portal/s-services/incoming-sem.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import * as XLSX from 'xlsx';


export enum ESemesterSelect {
    First = 'first semester',
    Second = 'second semester',
    Summer = 'summer semester'
}

export interface ISubjectBaseContext {
    code: string;
}

export interface ISemesterDataContext {
    id: string;
    year: string;
    semester: string;
    activated: boolean;
}

@Component({
    selector: 'app-opened-subj',
    templateUrl: './opened-subj.component.html',
    styleUrls: ['./opened-subj.component.css']
})
export class OpenedSubjComponent implements OnInit {

    semester_data: ISemesterDataContext[];
    current_semester_data: ISemesterDataContext;
    activated_semester_data: ISemesterDataContext;


    latest_opened_sub: MatTableDataSource<ISubjectBaseContext>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    table_size: number;
    table_content: ISubjectBaseContext[];
    displayedColumns: string[] = ['code'];

    excel_data: string[];
    fp_progress_max = 100;
    file_process_progress = 0;
    private file: File;
    private arrayBuffer: any;
    selected_semester: string;
    selected_year: string;

    @ViewChild('fileupload') fileupload: ElementRef;

    get sem_selection() {
        return Object.keys(ESemesterSelect);
    }


    constructor(private iNSS: IncomingSemService) {
        this.table_size = 0;
        this.table_content = [];
        this.excel_data = [];
        this.semester_data = [];
    }

    ngOnInit() {
        // this.load_table();
        this.load_table();
        this.load_semester_data_list();
    }

    load_semester_data_list() {
        this.semester_data = [];
        this.iNSS.get_semester_data_list()
            .then(x => {
                const res: any[] = x['body']['response'];
                this.semester_data = res.map<ISemesterDataContext>(y => {
                    return {
                        id: y['id'],
                        year: y['year'],
                        semester: y['semester'],
                        activated: y['activated']
                    };
                });
            })
            .then(() => {
                if (this.semester_data.length > 0) {
                    let have_ac = false;
                    for (const x of this.semester_data) {
                        if (x.activated) {
                            this.current_semester_data = x;
                            this.activated_semester_data = x;
                            have_ac = true;
                            break;
                        }
                    }
                    if (!have_ac) {
                        this.current_semester_data = this.semester_data[this.semester_data.length - 1];
                        this.activated_semester_data = this.current_semester_data;
                        this.activate_sem_data(this.current_semester_data.id);
                    }
                    this.load_latest_opened(this.current_semester_data.id);
                } else {
                    this.load_table();
                }
                setTimeout(() => {
                    swal.close();
                });
                if (this.semester_data.length === 0) {
                    this.latest_opened_sub = new MatTableDataSource([]);
                }
            });
    }

    activate_sem_data(_id) {
        swal({
            title: `Activate Semester data with ID of ${_id}?`,
            text: 'Are you sure?',
            buttons: {
                Yes: {
                    className: 'positive ui button',
                    value: 'yes'
                },
                No: {
                    className: 'negative ui button',
                    value: 'no'
                }
            }
        }).then(z => {
            switch (z) {
                case 'yes':
                    this.iNSS.activate_semester_data(_id)
                        .then(x => {
                            console.log('x', x['body']);
                            this.load_semester_data_list();
                        });
                    break;
                case 'no':
                    break;
                default:
                    break;
            }
        });
    }

    load_table() {
        this.latest_opened_sub = new MatTableDataSource(this.table_content);
        // this.latest_opened_sub.paginator = this.paginator;
        this.latest_opened_sub.sort = this.sort;
        this.table_size = this.latest_opened_sub.data.length;
        setTimeout(() => this.latest_opened_sub.paginator = this.paginator);
    }

    load_latest_opened(data_id) {
        if (this.semester_data.length === 0) {
            this.load_table();
            setTimeout(() => swal.close());
            return;
        }
        for (const x of this.semester_data) {
            if (x.id === data_id) {
                this.current_semester_data = x;
            }
        }
        this.iNSS.get_available_subjects({'data_id': String(data_id)})
            .then(x => {
                // swal_load();
                const content = x['body'];
                if (typeof content['data']['subjects'] !== 'undefined') {
                    const arr: string[] = content['data']['subjects'];
                    this.latest_opened_sub.data = arr.map(y => {
                        return {
                            code: y['code']
                        };
                    });
                    this.table_content = this.latest_opened_sub.data;
                    this.load_table();
                    setTimeout(() => {
                        swal.close();
                    });
                }
                // swal.close();
            });
    }

    load_props() {
        this.excel_data = [];
        this.fp_progress_max = 100;
        this.file_process_progress = 0;

    }

    reset_file_upload() {
        this.fileupload.nativeElement.value = '';
    }

    file_is_ready(): boolean {
        return this.fp_progress_max === this.file_process_progress && this.excel_data.length > 0;
    }

    upload_data() {
        if (typeof this.selected_year === 'undefined' ||
            typeof this.selected_semester === 'undefined' ||
            typeof this.excel_data === 'undefined' ||
            this.selected_semester.length === 0 ||
            this.excel_data.length === 0) {
            return;
        }
        console.log('this.excel_data.', this.excel_data);
        this.iNSS.post_available_subjects({
            semester: this.selected_semester.toLowerCase() + ' semester',
            year: this.selected_year,
            subject_code: this.excel_data
        }).then(x => {
            const content = x['body'];
            if (typeof content !== 'undefined') {
                const errs = content['response'];
                console.log(errs);
                this.load_semester_data_list();
                this.load_props();
                this.selected_year = '';
                this.selected_semester = '';
                this.fileupload.nativeElement.value = '';
            } else {
                swal({
                    title: 'Error in Uploading Data',
                    buttons: {
                        Return: true
                    }
                });
            }
        });
    }

    load_excel_data(event) {
        this.load_props();
        if (event.target.files.length === 0) {
            return;
        }
        console.log('ev', event);
        // this.file_path = event.target.files[0].toString();

        this.file = event.target.files[0];
        const fileReader = new FileReader();

        fileReader.onprogress = (e) => {
            if (e.lengthComputable) {
                this.fp_progress_max = e.total;
                this.file_process_progress = e.loaded;
            }
        };

        fileReader.onloadend = (e) => {
            console.log('load end');
        };
        fileReader.onload = (e) => {
            console.log('load start');
            this.file_process_progress = e.loaded;
            this.fp_progress_max = e.total;
            const read_promise = new Promise((resolve, reject) => {
                try {
                    // console.log('e', e);
                    this.arrayBuffer = fileReader.result;
                    const data = new Uint8Array(this.arrayBuffer);
                    const arr = [];
                    for (let i = 0; i !== data.length; ++i) {
                        arr[i] = String.fromCharCode(data[i]);
                    }
                    const bstr = arr.join('');
                    const workbook = XLSX.read(bstr, {type: 'binary'});
                    const first_sheet_name = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[first_sheet_name];
                    const file_data = XLSX.utils.sheet_to_json(worksheet, {raw: true});
                    resolve(file_data);
                } catch (z) {
                    reject(z);
                }
            });
            read_promise.then((args: any[]) => {
                try {
                    this.excel_data = args.map(x => {
                        const rv = x['Subjects'];
                        if (typeof rv === 'undefined') {
                            throw new Error('Excel Data Mapping Failed');
                        }
                        return x['Subjects'];
                    });
                    return this.excel_data;
                } catch (e) {
                    swal({
                        title: 'Mapping Error',
                        text: e.toString()
                    });
                    this.fileupload.nativeElement.value = '';
                }
            });


        };

        fileReader.readAsArrayBuffer(this.file);
    }

    delete_sem_data(_id) {
        swal({
            title: `Delete Semester data with ID of ${_id}?`,
            text: 'Are you sure?',
            buttons: {
                Yes: {
                    className: 'negative ui button',
                    value: 'yes'
                },
                No: {
                    className: 'positive ui button',
                    value: 'no'
                }
            }
        }).then(z => {
            switch (z) {
                case 'yes':
                    this.iNSS.delete_semester_data(_id)
                        .then(x => {
                            console.log('x', x['body']);
                            this.load_semester_data_list();
                        });
                    break;
                case 'no':
                    break;
                default:
                    break;
            }
        });
    }

    dl_template() {
        const title = 'Opened_subjects_template';
        const template_data = [
            {
                Subjects: ''
            }
        ];

        /* make the worksheet */
        const ws = XLSX.utils.json_to_sheet(template_data);

        /* add to workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title);

        /* generate an XLSX file */
        XLSX.writeFile(wb, `${title}.xlsx`);
    }
}

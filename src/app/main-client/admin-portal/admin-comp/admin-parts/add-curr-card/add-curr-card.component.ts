import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import {ALoginService} from '../../../a-services/a-login.service';
import * as XLSX from 'xlsx';
import {IBasicSubjectData, ICurriculumInstance, NewCurrService} from '../../../a-services/new-curr.service';
import swal from 'sweetalert';
import {HttpResponse} from '@angular/common/http';


export interface NewCurrData {
    department: string;
}

@Component({
    selector: 'app-add-curr-card',
    templateUrl: './add-curr-card.component.html',
    styleUrls: ['./add-curr-card.component.css']
})
export class AddCurrCardComponent implements OnInit {

    @ViewChild('modalTemplate')
    public modalTemplate: ModalTemplate<NewCurrData, string, string>;

    @ViewChild('fileupload')
    fileupload: ElementRef;

    private arrayBuffer: any;
    public data: any;
    public file_name: string;
    public file: File;
    public file_process_progress: number;
    public fp_progress_max: number;
    public uploading_in_progress: boolean;
    public new_cur_data: ICurriculumInstance;

    @Output() uponUploadFinish: EventEmitter<any> = new EventEmitter();

    get FILE_UPLOADING() {
        return this.file_process_progress < this.fp_progress_max;
    }

    constructor(private aLoginService: ALoginService,
                public modalService: SuiModalService,
                public newCurrService: NewCurrService) {
        this.file_name = '';
    }

    ngOnInit() {
        this.new_cur_data = {
            course: '',
            year: '',
            department: '',
            description: ''
        };
        this.reset_file_progress();
    }

    addSubject() {
        const n = this.new_cur_data.department;
        const config: TemplateModalConfig<NewCurrData, string, string> =
            new TemplateModalConfig<NewCurrData, string, string>(this.modalTemplate);
        config.isFullScreen = true;
        config.transition = '0';
        config.transitionDuration = 0;
        config.closeResult = 'closed!';
        console.log(this.modalTemplate.elementRef);
        config.context = {department: n};
        this.reset_file_progress();
        this.clear_fields();
        this.modalService
            .open(config);
    }

    reset_file_progress() {
        // this.file = null;
        this.fp_progress_max = 100;
        this.file_process_progress = 0;
        this.new_cur_data.department = this.aLoginService.getUserData()['department'];
        this.uploading_in_progress = false;
    }

    clear_fields() {
        this.new_cur_data.year = '';
        this.new_cur_data.course = '';
        this.new_cur_data.description = '';
    }

    required_unfilled(): boolean {
        return this.new_cur_data.description.length === 0 ||
            this.new_cur_data.year.length === 0 ||
            this.new_cur_data.course.length === 0 ||
            this.new_cur_data.department.length === 0;
    }

    is_year_verified() {
        const year_patt = /[0-9]{4}-[0-9]{4}/;
        // e.target.pattern = year_patt;
        return this.new_cur_data.year.match(year_patt);
    }

    year_input_on_change(e) {
        const year_patt = /[0-9]{4}-[0-9]{4}/;
        // e.target.pattern = year_patt;
        if (!this.new_cur_data.year.match(year_patt)) {
            this.new_cur_data.year = '';
        }
        console.log('this.new_cur_data.year', this.new_cur_data.year);
    }

    excelTemplateDownload() {
        const data = [
            {
                'CODE': '',
                'TITLE': '',
                'UNITS': '',
                'PRE-REQUISITE': '',
                'SEMESTER': '',
                'YEAR': ''
            }
        ];

        /* make the worksheet */
        const ws = XLSX.utils.json_to_sheet(data);

        /* add to workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Subjects');

        /* generate an XLSX file */
        XLSX.writeFile(wb, 'Subject Upload Template.xlsx');
    }

    upload_file(event) {
        this.reset_file_progress();
        this.file = event.target.files[0];
        const fileReader = new FileReader();
        fileReader.onprogress = (e) => {
            if (e.lengthComputable) {
                this.fp_progress_max = e.total;
                this.file_process_progress = e.loaded;
            }
        };
        fileReader.onload = (e) => {
            this.file_process_progress = e.loaded;
            this.fp_progress_max = e.total;
            const read_promise = new Promise((resolve, reject) => {
                try {
                    console.log('e', e);
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
                const rows_with_errors = [];
                const fine_rows = [];
                this.data = [];
                for (const row of args) {
                    try {
                        const c = String(row['CODE']).trim().toLowerCase();
                        const t = String(row['TITLE']).trim().toLowerCase();
                        const u = String(row['UNITS']).trim().toLowerCase();
                        const y = String(row['YEAR']).trim().toLowerCase() + ' year';
                        const s = String(row['SEMESTER']).trim().toLowerCase() + ' semester';
                        // map required fields
                        const rv: IBasicSubjectData = {
                            code: c,
                            title: t,
                            units: u,
                            year: y,
                            semester: s
                        };


                        // check if required fields are filled
                        for (const k of Object.keys(rv)) {
                            if (String(rv[k]).length === 0 || String(rv[k]).toLowerCase() === 'undefined') {
                                throw new Error('error in mapping');
                            }
                        }

                        // map optional rows
                        if (typeof row['PRE-REQUISITE'] !== 'undefined' && String(row['PRE-REQUISITE']).trim().toLowerCase() !== 'none') {
                            rv.pre_req = String(row['PRE-REQUISITE']).trim().toLowerCase();
                        }
                        // add if there is no error in mapping
                        fine_rows.push(rv);
                    } catch (e) {
                        // console.log('error in mapping', e);
                        rows_with_errors.push(args.indexOf(row));
                        // continue;
                    }


                    // do not add if the required field is not fulfilled
                    // if (req_fields_not_met) {
                    //     rows_with_errors.push(index);
                    //     continue;
                    // }

                }
                return {fine_rows, rows_with_errors};
                // this.data = args.map((x) => {
                //     // return {question: x['question'], choices: x['choices'], answer: x['answer']}
                //
                //     return rv;
                // });
            }).then(({fine_rows, rows_with_errors}) => {
                console.log('rows_with_errors', rows_with_errors);
                if (rows_with_errors.length > 0) {
                    const error_rows = rows_with_errors.map(x => x + 2);
                    swal({
                        title: 'Warning',
                        icon: 'warning',
                        text: `
                        There is an error in Mapping Data From Excel.
                        Rows with Error: ${error_rows.join(',')}
                        The system will ignore this rows
                        Do you still want to continue using this data?.
                        `,
                        buttons: {
                            YES: {
                                text: 'YES',
                                value: 'YES',
                                className: 'negative ui button'
                            },
                            NO: {
                                text: 'NO',
                                value: 'NO',
                                className: 'positive ui button'
                            }
                        }
                    })
                        .then(resp => {
                            switch (resp) {
                                case 'YES':
                                    this.data = fine_rows;
                                    break;
                                case 'NO':
                                    this.data = [];
                                    this.reset_file_uploader();
                                    break;
                            }
                        })
                        .then(() => {
                            console.log('this.data', this.data);
                        });
                } else {
                    this.data = fine_rows;
                }
            });
        };
        fileReader.readAsArrayBuffer(this.file);
    }

    reset_file_uploader() {
        this.fileupload.nativeElement.value = '';
        this.reset_file_progress();
    }


    createNewCurriculum() {
        const _k = Object.keys(this.new_cur_data);
        const err_req = [];
        for (const __k of _k) {
            if (String(this.new_cur_data[__k]).length === 0) {
                err_req.push(`${__k} is required`);
            }
        }
        if (err_req.length > 0) {
            swal({
                title: 'Errors',
                text: err_req.join('\n'),
                buttons: {
                    OKAY: true
                }
            });
            return;
        }
        console.log('json to send', JSON.stringify(this.data));
        this.uploading_in_progress = true;
        this.newCurrService.createCurriculum(this.new_cur_data)
            .then((data: any) => {
                console.log('data res', data);
                const _cid: string = data['curriculum_id'];
                if (typeof _cid !== 'undefined') {
                    return _cid;
                }
                return null;
            }, (rej) => {
                this.uploading_in_progress = false;
                return rej;
            }).then((_data: any) => {
            this.uploading_in_progress = false;
            if (_data !== null) {
                this.newCurrService.addSubjectToCurriculum(_data, this.data)
                    .then((resp) => {
                        const _r = resp['response'];
                        swal({
                            title: 'Upload Finished',
                            text: 'Upload Successful',
                            buttons: {
                                Back: true
                            }
                        }).then((k) => {
                            // window.location.reload();
                            this.uponUploadFinish.emit(k);
                        });
                    })
                    .catch(x => {
                        swal.close();
                        swal({
                            title: 'Uploading Failed',
                            text: 'There is an error in uploading data',
                            buttons: {
                                Back: true
                            }
                        });
                    });
            }
        });
    }
}


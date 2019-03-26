import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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

    excelTemplateDownload() {
        const data = [
            {
                'subject code': '',
                'title': '',
                'units': '',
                'pre-requisite': '',
                'semester': '',
                'year': ''
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
                this.data = args.map((x) => {
                    // return {question: x['question'], choices: x['choices'], answer: x['answer']}
                    const rv: IBasicSubjectData = {
                        code: x['subject code'],
                        title: x['title'],
                        units: x['units'],
                        year: (x['year'] + ' year').toLowerCase(),
                        semester: (x['semester'] + ' semester').toLowerCase()
                    };
                    if (typeof x['pre-requisite'] !== 'undefined') {
                        rv.pre_req = x['pre-requisite'];
                    }
                    return rv;
                });
            }).then(() => {
                console.log('this.data', this.data);
            });
        };
        fileReader.readAsArrayBuffer(this.file);
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


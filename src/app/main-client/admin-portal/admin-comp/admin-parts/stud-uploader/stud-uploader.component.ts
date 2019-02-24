import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PostStudentData} from '../../../a-services/PostStudentData';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';

@Component({
    selector: 'app-stud-uploader',
    templateUrl: './stud-uploader.component.html',
    styleUrls: ['./stud-uploader.component.css']
})
export class StudUploaderComponent<T> implements OnInit {

    @Input() postStudentData: PostStudentData<T>;
    @Input() inputTitle: string;
    @Input() template_title: string;
    @Output() excelLoaded: EventEmitter<any> = new EventEmitter<any>();
    @Output() startTemplateDownload: EventEmitter<any> = new EventEmitter<any>();
    @Output() excelLoadError: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('fileupload') fileupload: ElementRef;
    private template_data: any[];

    private excel_data: any[];
    private arrayBuffer: any;
    private file: File;
    fp_progress_max: number;
    file_process_progress: number;


    constructor() {
        this.load_props();
        this.load_template_props();
    }

    ngOnInit() {
        if (this.postStudentData === null) {
            throw new Error('postStudentData input is required');
        }
        if (this.inputTitle === null) {
            throw new Error('inputTitle input is required');
        }
    }

    load_template_props() {
        this.template_data = [];
        this.template_title = '';
    }

    load_props() {
        this.excel_data = [];
        this.fp_progress_max = 100;
        this.file_process_progress = 0;
    }

    reset_file_upload() {
        this.fileupload.nativeElement.value = '';
    }


    swal_finish(message: string = '') {
        const p = {
            title: 'Process Finished',
            buttons: {
                Return: true
            }
        };
        if (message.length > 0) {
            p['text'] = 'Message: ' + message;
        }
        swal(p);
    }

    get HaveTemplateTitle(): boolean {
        return this.template_title.length > 0;
    }

    setExcelTemplate<t>(template: t[], title: string = '') {
        this.template_data = template;
        this.template_title = title.length > 0 ? title : this.template_title;
        console.log('this.excel_data ', this.template_data);
    }

    download_template() {
        this.startTemplateDownload.emit();

        /* make the worksheet */
        const ws = XLSX.utils.json_to_sheet(this.template_data);

        /* add to workbook */
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, this.template_title);

        /* generate an XLSX file */
        XLSX.writeFile(wb, `${this.template_title}.xlsx`);
    }

    mapExcelData<i, o = T>(cb: (data: i[]) => o[]) {
        try {
            this.excel_data = cb(this.excel_data);
        } catch (e) {
            console.log('err', e);
            this.excelLoadError.emit(e);
            this.load_props();
        }

        console.log('this.excel_data ', this.excel_data);
    }

    upload_data() {
        if (this.file_is_ready()) {
            const p = new Promise((resolve, reject) => {
                try {
                    // this.invokeMap.emit(this.excel_data);
                    resolve(this.excel_data);
                } catch (e) {
                    reject(e);
                }
            }).then((r) => {
                console.log('studComponent data', r);
                this.postStudentData
                    .uploadData(this.excel_data)
                    .then((r_body: any[]) => {
                        const rb = r_body['response'];
                        console.log('response', rb);
                        this.load_props();
                        const mg = `errors in: ${rb['errors'].toString()}`;
                        this.swal_finish(rb['errors'].length > 0 ? mg : '');
                        this.reset_file_upload();
                    }, (rej) => {
                        console.log('rejected', rej);
                    });
            });
        }

    }

    file_is_ready(): boolean {
        return this.fp_progress_max === this.file_process_progress && this.excel_data.length > 0;
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
                this.excel_data = args;
                this.excelLoaded.emit();
                return args;
                // this.excel_data = args.map(x => {
                //     return x;
                // });
            });
        };

        fileReader.readAsArrayBuffer(this.file);
    }
}

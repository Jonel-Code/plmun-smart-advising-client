import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
    @Output() invokeMap: EventEmitter<any> = new EventEmitter<any>();

    private excel_data: any[];
    private arrayBuffer: any;
    private file: File;
    fp_progress_max: number;
    file_process_progress: number;


    constructor() {
        this.load_props();
    }

    ngOnInit() {
        if (this.postStudentData === null) {
            throw new Error('postStudentData input is required');
        }
        if (this.inputTitle === null) {
            throw new Error('inputTitle input is required');
        }
    }

    load_props() {
        this.excel_data = [];
        this.fp_progress_max = 100;
        this.file_process_progress = 0;
    }


    swal_finish() {
        swal({
            title: 'Process Finished',
            buttons: {
                Return: true
            }
        });
    }

    upload_data() {
        if (this.file_is_ready()) {
            const p = new Promise((resolve, reject) => {
                try {
                    this.invokeMap.emit(this.excel_data);
                    resolve(this.excel_data);
                } catch (e) {
                    reject(e);
                }
            }).then((r) => {
                console.log('data', r);
                return null;
                this.postStudentData
                    .uploadData(this.excel_data)
                    .then((r_body: any[]) => {
                        console.log('response', r_body['response']);
                        this.swal_finish();
                    }, (rej) => {
                        console.log('rejected', rej);
                    });
            });
        }

    }

    file_is_ready(): boolean {
        return this.fp_progress_max <= this.file_process_progress && this.excel_data.length > 0;
    }

    load_excel_data(event) {
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
                this.excel_data = args.map(x => {
                    return x;
                });
            });
        };

        fileReader.readAsArrayBuffer(this.file);
    }
}

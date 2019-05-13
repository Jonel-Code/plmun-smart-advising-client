import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import * as XLSX from 'xlsx';
import {ClusterPostService} from './cluster-post.service';
import swal from 'sweetalert';


interface ClusterDataContext {
    name: string;
    subjects: string[];
}

@Component({
    selector: 'app-subject-clusters',
    templateUrl: './subject-clusters.component.html',
    styleUrls: ['./subject-clusters.component.css']
})
export class SubjectClustersComponent implements OnInit {


    @ViewChild('fileupload') fileupload: ElementRef;

    private excel_data: any[];
    private arrayBuffer: any;
    private file: File;
    fp_progress_max: number;
    file_process_progress: number;
    cluster_data: ClusterDataContext[];

    private saved_cluster_key = 'cluster_items';

    constructor(private clusterPostService: ClusterPostService, private _ngZone: NgZone) {
        this.load_props();
    }

    get_cluster_subjects(): null | ClusterDataContext[] {
        const x: ClusterDataContext[] = JSON.parse(localStorage.getItem(this.saved_cluster_key));
        return (!x) ? null : x;
    }

    ngOnInit() {
        // this.load_subject_clusters();
        this.init_cluster_data();
    }

    init_cluster_data() {
        this._ngZone.run(async () => {
            this.cluster_data = this.get_cluster_subjects();
            if (this.cluster_data == null) {
                await this.load_subject_clusters();
                this.cluster_data = this.get_cluster_subjects();
            }
            console.log('this.cluster_data', this.cluster_data);
        });

    }

    load_subject_clusters() {
        return this.clusterPostService.get_all()
            .then(x => {
                console.log('x', x);
                localStorage.setItem(this.saved_cluster_key, JSON.stringify(x));
            });
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


    load_props() {
        this.excel_data = [];
        this.fp_progress_max = 100;
        this.file_process_progress = 0;
    }

    reset_file_upload() {
        this.fileupload.nativeElement.value = '';
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
            }).then((r: any[]) => {
                console.log('SubjectClustersComponent data', r);
                this.clusterPostService.upload(r)
                    .then((r_body: any[]) => {
                        const msg = r_body['message'];
                        console.log('msg', msg);
                        this.load_props();
                        localStorage.removeItem(this.saved_cluster_key);
                        this.swal_finish('Upload Finished!');
                    }, (rej) => {
                        console.log('rejected', rej);
                    });
                // this.postStudentData
                //     .uploadData(this.excel_data)
                //     .then((r_body: any[]) => {
                //         const rb = r_body['response'];
                //         console.log('response', rb);
                //         this.load_props();
                //         const mg = `errors in: ${rb['errors'].toString()}`;
                //         this.swal_finish(rb['errors'].length > 0 ? mg : '');
                //
                //     }, (rej) => {
                //         console.log('rejected', rej);
                //     });
            }).then(() => {
                this.reset_file_upload();
                this.init_cluster_data();
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
                    // const file_data = [];
                    // for (const item in worksheet) {
                    //
                    // }
                    const file_data = XLSX.utils.sheet_to_json(worksheet, {header: 1, raw: true});
                    // const fd = XLSX.utils.sheet
                    resolve(file_data);
                } catch (z) {
                    reject(z);
                }
            });

            read_promise.then((args: any[]) => {
                this.excel_data = args;
                console.log(' this.excel_data', this.excel_data);
                // this.excelLoaded.emit();
                return args;
                // this.excel_data = args.map(x => {
                //     return x;
                // });
            });
        };

        fileReader.readAsArrayBuffer(this.file);
    }
}

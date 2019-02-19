import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import {CurrListingService} from '../../../a-services/curr-listing.service';
import swal from 'sweetalert';
import {DelCurrService} from '../../../a-services/del-curr.service';
import * as XLSX from 'xlsx';

export interface CurriculumCardData {
    course: string;
    description: string;
    year: string;
    id: string;
}

export interface IContext {
    data: CurrSubjectData[];
}

export interface CurrSubjectData {
    subject_id: string;
    subject_code: string;
    title: string;
    units: string;
    pre_req: string[];
    year: string;
    semester: string;
}

@Component({
    selector: 'app-curr-card',
    templateUrl: './curr-card.component.html',
    styleUrls: ['./curr-card.component.css']
})
export class CurrCardComponent implements OnInit {

    @ViewChild('modalTemplate')
    public modalTemplate: ModalTemplate<IContext, string, string>;

    @Input() curriculumData: CurriculumCardData;

    @Output() uponDelete: EventEmitter<any> = new EventEmitter();

    private _modal: any;


    cur_data: CurrSubjectData[];

    constructor(public modalService: SuiModalService,
                private currListingService: CurrListingService,
                private delCurrService: DelCurrService) {
        this.cur_data = [];
    }

    ngOnInit() {
        console.log('curriculumData', this.curriculumData);
    }

    viewSubjects() {
        this.cur_data = [];
        this.currListingService.getCurriculumData(this.curriculumData.id)
            .then(x => {
                    const d = x['data_received'];
                    if (typeof d !== 'undefined') {
                        const s = d['subjects'];
                        for (const z of s) {
                            this.cur_data.push({
                                subject_id: z['subject_id'],
                                subject_code: z['subject_code'],
                                title: z['title'],
                                pre_req: z['pre_req'],
                                year: z['year'],
                                semester: z['semester'],
                                units: String(z['units']),
                            });
                        }
                    }
                }
            ).then(() => {
            console.log('this.cur_data', this.cur_data);
            const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);
            config.isFullScreen = true;
            config.transition = '0';
            config.transitionDuration = 0;
            config.closeResult = 'closed!';
            console.log(this.modalTemplate.elementRef);
            config.context = {data: this.cur_data};
            this._modal = this.modalService.open(config);
        });
    }

    deleteCurriculum() {
        swal({
            title: 'Do you want to delete this Curriculum?',
            text: `${this.curriculumData.course} - ${this.curriculumData.year}\n${this.curriculumData.description}`,
            icon: 'warning',
            buttons: {
                YES: {
                    className: 'negative ui medium button',
                    value: 'YES'
                },
                NO: {
                    className: 'positive ui medium button',
                    value: 'NO'
                }
            }
        }).then((res) => {
            switch (res) {
                case 'YES':
                    this.executeCurriculumDelete();
                    break;
                case 'NO':
                    break;
                default:
                    break;
            }
        });
    }

    executeCurriculumDelete() {
        console.log('Deleting curriculum');
        this.delCurrService.removeCurriculum(this.curriculumData.id)
            .then((x) => {
                this._modal.deny();
                this.uponDelete.emit(this.curriculumData);
            }, (z) => {
            });
    }

    downloadCurriculum() {
        if (this.cur_data.length > 0) {
            const _d = new Date();
            const _ts = `${_d.toDateString()}_${_d.toTimeString()}`;
            /* make the worksheet */
            const c = this.cur_data.map(x => {
                return {
                    'CODE': x.subject_code,
                    'TITLE': x.title,
                    'UNITS': x.units,
                    'PRE-REQUISITE': x.pre_req.length > 0 ? x.pre_req : 'NONE',
                    'SEMESTER': x.semester,
                    'YEAR': x.year
                };
            });
            const ws = XLSX.utils.json_to_sheet(c);

            /* add to workbook */
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Subjects');

            /* generate an XLSX file */
            XLSX.writeFile(wb, `${this.curriculumData.course}_${this.curriculumData.year}_${this.curriculumData.description}_${_ts}.xlsx`);
        }
    }
}



import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import {CurrListingService} from '../../../a-services/curr-listing.service';

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
    pre_req: string[];
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


    test_arr = Array(200).fill(4); // [4,4,4,4,4]
    cur_data: CurrSubjectData[];

    constructor(public modalService: SuiModalService,
                private currListingService: CurrListingService) {
        this.cur_data = [];
    }

    ngOnInit() {
        console.log('curriculumData', this.curriculumData);
    }

    viewSubjects() {
        // this.modalService
        //     .open(new CurrSubjListModal(this.curriculumData.id.toString()));.
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

                            });
                        }
                    }
                }
            ).then(() => {
            const config = new TemplateModalConfig<IContext, string, string>(this.modalTemplate);
            config.isFullScreen = true;
            config.transition = '0';
            config.transitionDuration = 0;
            config.closeResult = 'closed!';
            console.log(this.modalTemplate.elementRef);
            config.context = {data: this.cur_data};
            this.modalService
                .open(config);
        });

    }
}



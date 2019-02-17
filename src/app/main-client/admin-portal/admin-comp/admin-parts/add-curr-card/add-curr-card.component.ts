import {Component, OnInit, ViewChild} from '@angular/core';
import {SuiModalService, TemplateModalConfig, ModalTemplate} from 'ng2-semantic-ui';
import {ALoginService} from '../../../a-services/a-login.service';

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

    constructor(private aLoginService: ALoginService,
                public modalService: SuiModalService,) {
    }

    ngOnInit() {
    }

    addSubject() {
        const n = this.aLoginService.getUserData()['department'];
        const config = new TemplateModalConfig<NewCurrData, string, string>(this.modalTemplate);
        config.isFullScreen = true;
        config.transition = '0';
        config.transitionDuration = 0;
        config.closeResult = 'closed!';
        console.log(this.modalTemplate.elementRef);
        config.context = {department: n};
        this.modalService
            .open(config);
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {is_table_in_mobile_view} from '../../helper-scripts/table-min-width';

@Component({
    selector: 'app-mobile-label',
    templateUrl: './mobile-label.component.html',
    styleUrls: ['./mobile-label.component.css']
})
export class MobileLabelComponent implements OnInit {

    @Input() mobileLabel: string;

    constructor() {
    }

    ngOnInit() {
    }

    isMobileView(): boolean {
        return is_table_in_mobile_view();
    }

}

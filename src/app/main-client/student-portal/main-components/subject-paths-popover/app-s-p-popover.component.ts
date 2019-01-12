import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-s-p-popover',
    templateUrl: './app-s-p-popover.component.html',
    styleUrls: ['./app-s-p-popover.component.css']
})
export class SPPopoverComponent implements OnInit {
    @Input() data: any;

    constructor() {
    }

    ngOnInit() {
    }

}

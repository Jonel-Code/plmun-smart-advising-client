import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource} from '@angular/material';
import {ISubject, StudentStatusEnum} from '../../../../login/login.service';
import {getDate} from 'ngx-bootstrap/chronos/utils/date-getters';

export interface IBasicStudentInformation {
    name: string;
    course: string;
    id: string;
    status: StudentStatusEnum;
    year: string;
}

export interface IAdvisingFormData {
    subjects: ISubject[];
    student: IBasicStudentInformation;
    incoming_semester: string;
}

@Component({
    selector: 'app-advising-form',
    templateUrl: './advising-form.component.html',
    styleUrls: ['./advising-form.component.css']
})
export class AdvisingFormComponent implements OnInit {

    // displayedColumns: string[] = ['code', 'title', 'units', 'day', 'time', 'room', 'section'];
    displayedColumns: string[] = ['code', 'title', 'units'];
    tableData: MatTableDataSource<ISubject>;


    constructor(@Inject(MAT_DIALOG_DATA) public data: IAdvisingFormData) {
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        const _tblData = [];
        for (const i of this.data.subjects) {
            _tblData.push(i);
        }
        this.tableData = new MatTableDataSource<ISubject>(_tblData);
    }

    totalUnits() {
        return this.data.subjects.map(i => i.total_units).reduce((a, c) => a + c, 0);
    }

    print(): void {
        let printContents, popupWin;
        const hashKey = btoa(Date.now().toString() + this.data.student.id);
        printContents = document.getElementById('advising-form-print').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
      <html>
        <head>
          <title>Advising Form - ${hashKey}</title>
          <style>
            .content-wrapper {
                width: 100%;
            }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
        );
        popupWin.document.close();
    }

}

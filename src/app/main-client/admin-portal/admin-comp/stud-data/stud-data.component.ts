import {Component, OnInit, ViewChild} from '@angular/core';
import {IDataUpContext, IGradeUpContext, SDataUpService, SGradeUpService} from '../../a-services/s-data-up.service';
import {StudUploaderComponent} from '../admin-parts/stud-uploader/stud-uploader.component';

@Component({
    selector: 'app-stud-data',
    templateUrl: './stud-data.component.html',
    styleUrls: ['./stud-data.component.css']
})
export class StudDataComponent implements OnInit {

    @ViewChild('sdata') sdata: StudUploaderComponent<IDataUpContext>;
    @ViewChild('sgrade') sgrade: StudUploaderComponent<IGradeUpContext>;

    constructor(public sDataUpService: SDataUpService<IDataUpContext>,
                public sGradeUpService: SGradeUpService<IGradeUpContext>) {
    }

    ngOnInit() {
    }

    mapData(e: any[]): void {
        const nv = e.map<IDataUpContext>(x => {
            return {
                student_id: x['student id'],
                full_name: x['name'],
                course: x['course'],
                year: x['year'],
            };
        });
        console.log('sdata inkvoke', nv);
        e = nv;
    }

    mapGrade(e: any[]): void {
        const nv = e.map<IGradeUpContext>(x => {
            return {
                student_id: x['student id'],
                subject_code: x['subject code'],
                grade: x['grade'],
            };
        });
        e = nv;
    }

}

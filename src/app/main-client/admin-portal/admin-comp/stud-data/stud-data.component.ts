import {Component, OnInit, ViewChild} from '@angular/core';
import {IDataUpContext, IGradeUpContext, SDataUpService, SGradeUpService} from '../../a-services/s-data-up.service';
import {StudUploaderComponent} from '../admin-parts/stud-uploader/stud-uploader.component';
import swal from 'sweetalert';


export interface IStudentGradeTemplate {
    'Student id': string;
    'Subject Code': string;
    'Grade': number;
}

export interface IStudentDataTemplate {
    'Student id': string;
    'Name': string;
    'Course': string;
    'Year': string;
}

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

    reMapData() {
        this.sdata.mapExcelData<IStudentDataTemplate>((d: IStudentDataTemplate[]) => {
            console.log('data_ remap', d);
            return d.map<IDataUpContext>((x) => {
                return {
                    student_id: String(x['Student id']).replace(/\s+/g, ''),
                    full_name: x.Name.toLowerCase().trim(),
                    course: x.Course.toLowerCase().trim(),
                    year: x.Year.toLowerCase().trim(),
                };
            });
        });
    }

    reMapGrade() {
        this.sgrade.mapExcelData<IStudentGradeTemplate>((data: IStudentGradeTemplate[]) => {
            return data.map<IGradeUpContext>((x) => {
                return {
                    student_id: String(x['Student id']).replace(/\s+/g, ''),
                    subject_code: String(x['Subject Code']).trim().toLowerCase(),
                    grade: x.Grade
                };
            });
        });
    }

    mapDataTemplate() {
        this.sdata.setExcelTemplate<IStudentDataTemplate>(
            [
                {
                    'Student id': '',
                    'Name': '',
                    'Course': '',
                    'Year': ''
                },
            ]
        );
    }

    mapGradeTemplate() {
        this.sgrade.setExcelTemplate<IStudentGradeTemplate>(
            [
                {
                    'Student id': '',
                    'Subject Code': '',
                    'Grade': 0,
                },
            ]
        );
    }

    loadError(e) {
        swal({
            title: 'OPPPSS! something is wrong',
            text: `There is a problem on processing the data please use the template provided and try to upload the data load again`,
            buttons: {
                RETURN: true,
            }
        });
    }
}

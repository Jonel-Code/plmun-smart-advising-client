import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SLoginService} from './s-login.service';
import {CustomDTree, Edges, Leaf} from '../../../core/algorithms/CustomDTree';
import {IncomingSemService} from './incoming-sem.service';
import {HttpResponse} from '@angular/common/http';
import swal from 'sweetalert';


export enum EStudentStatus {
    IRREGULAR = 'IRREGULAR',
    REGULAR = 'REGULAR'
}

export enum ESemester {
    FIRST = 'FIRST', SECOND = 'SECOND', SUMMER = 'SUMMER'
}

export enum EYear {
    FIRST = 'FIRST', SECOND = 'SECOND', THIRD = 'THIRD', FOURTH = 'FOURTH'
}

export interface ICourseCurriculum {
    curriculum_id: number;
    description: string;
    course: string;
    year: string;
    subjects: ICurriculumSubject[];
}

export interface ISubjectGrade {
    code: string;
    grade: number;
}

export interface ICurriculumSubject {
    code: string;
    title: string;
    total_units: string;
    pre_req: string[];
    year: EYear;
    semester: ESemester;
}

export interface IStudentStore {
    name: string;
    id: string;
    course: string;
    year: EYear;
    status: EStudentStatus;
    incoming_semester: IIncomingDataContext;
    course_curriculum: ICourseCurriculum;
    subjects_taken: ISubjectGrade[];
    can_take: string[];
    back_subjects: string[];
    can_take_this_semester: string[];
    not_taken_subj?: ICurriculumSubject[];
}

export interface IIncomingDataContext {
    year: string;
    semester: ESemester;
    subjects: string[];
    subjects_items?: { id: number, code: string }[];
    semester_id?: number;
}

export class StudentStoreData implements IStudentStore {
    id: string;
    name: string;
    course: string;
    year: EYear;
    status: EStudentStatus;
    course_curriculum: ICourseCurriculum;
    subjects_taken: ISubjectGrade[];
    back_subjects: string[];
    can_take: string[];
    incoming_semester: IIncomingDataContext;
    can_take_this_semester: string[];
    not_taken_subj?: ICurriculumSubject[];
    subjects_items?: { id: number, code: string }[];

    constructor() {
        this.name = '';
        this.id = '';
        this.course = '';
        this.year = EYear.FIRST;
        this.status = EStudentStatus.REGULAR;
        this.course_curriculum = null;
        this.subjects_taken = [];
        this.back_subjects = [];
        this.can_take = [];
        this.incoming_semester = null;
        this.can_take_this_semester = [];
        this.not_taken_subj = [];
        this.subjects_items = [];
    }

    public static is_pass_or_taken(grade: number) {
        return grade >= 0 && grade <= 3.0;
    }
}

@Injectable()
export class SStore {
    private _student_data: BehaviorSubject<IStudentStore> = new BehaviorSubject<IStudentStore>(new StudentStoreData());

    readonly student_data: Observable<IStudentStore> = this._student_data.asObservable();

    is_loaded = false;

    public d3_algo: CustomDTree = null;
    public d3_algo_finised: EventEmitter<CustomDTree> = new EventEmitter();


    constructor(private sLoginService: SLoginService,
                private incomingSemService: IncomingSemService) {
    }

    get student_data_values() {
        return this._student_data.getValue();
    }

    public get_regular_subjecst() {
        const rv = [];
        if (!this.student_data_values.incoming_semester || !this.student_data_values.year || !this.student_data_values.course_curriculum) {
            return rv;
        }
        const is = this.student_data_values.incoming_semester.semester;
        const subs = this.student_data_values.course_curriculum.subjects;
        const sy = this.student_data_values.year;
        for (const x of subs) {
            if (sy === x.year && is === x.semester) {
                rv.push(x);
            }
        }
        return rv;

    }

    public save_auth_vals(u, p) {
        localStorage.setItem('au', JSON.stringify({u: u, p: p}));
    }

    public load_auth_vals() {
        return JSON.parse(localStorage.getItem('au'));
    }

    load_student_data(u, p) {
        this.is_loaded = true;
        this.save_auth_vals(u, p);
        return new Promise((resolve, reject) => {
            try {
                this.sLoginService.login(u, p)
                    .then((x: HttpResponse<any>) => {
                        console.log('fetched data', x);
                        if (x['body'] === undefined) {
                            reject(x);
                            throw new Error('error in http');
                        }
                        const content = x['body']['content'];
                        console.log('new login', x);
                        this.set_general_data(content);
                        return x;
                    })
                    .then((x) => {
                        this.set_subject_data();
                        console.log('updated_data', this._student_data.getValue());
                        return x;
                    })
                    .then((x) => {
                        this.set_semester_data()
                            .then(() => {
                                resolve(x);
                            });
                    });
            } catch (e) {
                // reject(e);
                this.is_loaded = false;
            }
        });
    }

    is_authenticated(): Promise<boolean> {
        const au = this.load_auth_vals();
        if (!au || !au.u || !au.p) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        }
        return this.sLoginService.check_auth(au.u, au.p)
            .then((x) => {
                console.log('x', x);
                return x['access'] === 'allow';
            }).catch(x => {
                return false;
            });
    }

    private is_pass_or_taken(grade: number) {
        return grade >= 0 && grade <= 3.0;
    }

    set_can_take_this_sem() {
        const sd = this._student_data.getValue();
        if (!(sd.incoming_semester && sd.course_curriculum && sd.can_take)) {
            return;
        }
        const ix = [];
        for (const ct of sd.can_take) {
            if (sd.incoming_semester.subjects.includes(ct)) {
                ix.push(ct);
            }
        }
        sd.can_take_this_semester = ix;
        this._student_data.next(sd);
        console.log('with can_take_this_sem', this._student_data.getValue());
    }

    set_semester_data() {
        return this.incomingSemService.get_available_subjects()
            .then(x => {
                console.log('sem_data', x);
                const content = x['body']['data'];
                if (!content) {
                    return;
                }
                const sd = this._student_data.getValue();
                const sb = [];
                const sb_data_items: { id: number, code: string }[] = [];
                if (Array.isArray(content['subjects'])) {
                    for (const s of content['subjects']) {
                        sb.push(String(s['code']).toLowerCase());
                        sb_data_items.push({id: Number(s['id']), code: String(s['code']).toLowerCase()});
                    }
                }
                sd.incoming_semester = {
                    year: content['year'],
                    semester: ESemester[String(content['semester']).toUpperCase()],
                    subjects: sb,
                    subjects_items: sb_data_items,
                    semester_id: content['semester_id']
                };
                this._student_data.next(sd);
                console.log('with_semester_data', this._student_data.getValue());
            })
            .then(() => {
                this.set_can_take_this_sem();
            })
            .then(() => {
                this.set_back_subjects();
                console.log('with_back_subjects', this._student_data.getValue());
            })
            .then(() => {
                this.set_status();
                console.log('with_back_subjects', this._student_data.getValue());
            });
    }


    private set_general_data(content: any) {
        const sd = this._student_data.getValue();
        sd.name = content['name'];
        sd.id = content['id'];
        sd.course = content['course'];
        sd.year = EYear[String(content['year']).toUpperCase()];

        const cd = content['course_curriculum'];
        const cd_s = cd['subjects'];
        let cd_ss = [];
        if (Array.isArray(cd_s)) {
            cd_ss = cd_s.map(c => {
                return {
                    code: c['subject_code'],
                    title: c['title'],
                    total_units: c['units'],
                    pre_req: c['pre_req'],
                    year: EYear[String(c['year']).toUpperCase()],
                    semester: ESemester[String(c['semester']).toUpperCase()],
                };
            });
        }

        sd.course_curriculum = {
            curriculum_id: cd['curriculum_id'],
            year: cd['year'],
            description: cd['description'],
            course: cd['course'],
            subjects: cd_ss
        };

        const gs = content['grades'];
        let gss = [];
        if (Array.isArray(gs)) {
            gss = gs.map(z => {
                return {
                    code: z['code'],
                    grade: Number(z['grade'])
                };
            });
        }
        sd.subjects_taken = gss;

        this._student_data.next(sd);
    }

    private set_subject_data() {
        console.log('fetched_data', this._student_data.getValue());
        const sd = this._student_data.getValue();
        if (!Array.isArray(sd.course_curriculum.subjects)) {
            return;
        }
        const ds: { code: string, pre_req: string[] }[] = sd.course_curriculum.subjects.map(q => {
            return {
                code: q.code,
                pre_req: q.pre_req
            };
        });
        const ps = [];
        sd.subjects_taken.forEach(q => {
            if (this.is_pass_or_taken(q.grade)) {
                ps.push(q.code);
            }
        });
        const ct = this.get_can_take_subjects(ds, sd.year, ps);
        sd.can_take = ct.map(q => {
            return q.identifier;
        });
        const not_taken: ICurriculumSubject[] = [];
        sd.course_curriculum.subjects.forEach((x: ICurriculumSubject) => {
            if (!ps.includes(x.code.toLowerCase())) {
                not_taken.push(x);
            }
        });
        sd.not_taken_subj = not_taken;
        this._student_data.next(sd);
    }

    private get_can_take_subjects(data: { code: string, pre_req: string[] }[],
                                  year: EYear,
                                  passed_subjects: string[]): Leaf[] {
        const d_setz = [];
        console.log('use_d', data);
        data.slice().forEach(x => {
            const p: Leaf = {identifier: x.code.toLowerCase()};
            // console.log('x.code', x.code);
            if (typeof p !== 'undefined') {
                const c: Leaf[] = [];
                if (x.pre_req.length > 0) {
                    x.pre_req.forEach(z => {
                        const n = {identifier: z.toLowerCase()};
                        if (typeof z === 'string') {
                            c.push(n);
                        }
                    });
                } else {
                    const n = {identifier: ''};
                    c.push(n);
                }
                if (c.length > 0 && typeof p !== 'undefined') {
                    for (const ch of c) {
                        if (typeof ch.identifier === 'string' && typeof p.identifier === 'string') {
                            const new_e: Edges = {
                                parent: p,
                                child: ch
                            };
                            d_setz.push(new_e);
                        }
                    }
                }
            }
        });

        const yi = [];
        for (const i of Object.keys(EYear)) {
            yi.push(EYear[i].toString().toLowerCase());
            if (EYear[i] === year) {
                break;
            }
        }

        this.d3_algo = null;

        console.log('yi', yi);
        console.log('d_setz', d_setz);
        const new_3 = new CustomDTree(d_setz);
        console.log('d3 es:', new_3);
        new_3.pruneLeaf({identifier: ''});
        for (const y of yi) {
            new_3.pruneLeaf({identifier: y});
        }
        for (const s of passed_subjects) {
            new_3.pruneLeaf({identifier: s});
        }
        console.log('pruned_3', new_3);
        console.log('leaf_nodes()', new_3.leaf_nodes);

        this.d3_algo = new_3;
        this.d3_algo_finised.emit(this.d3_algo);
        return new_3.leaf_nodes;
    }

    private set_back_subjects() {
        const years = Object.keys(EYear);
        const semesters = Object.keys(ESemester);
        const sd = this.student_data_values;
        const yi = years.indexOf(sd.year);
        const si = semesters.indexOf(sd.incoming_semester.semester);
        console.log('incoming sem', si);
        const back_subjects = [];
        for (let x = 0; x <= yi; x++) {
            let _si = semesters.length;
            if (x === yi) {
                _si = si;
            }
            const ys = EYear[years[x]];
            console.log('ys', ys);
            for (let y = 0; y < _si; y++) {
                const ss = ESemester[semesters[y]];
                sd.not_taken_subj.forEach((s: ICurriculumSubject) => {
                    if (s.year === ys && s.semester === ss) {
                        back_subjects.push(s);
                    }
                });
            }
        }
        sd.back_subjects = back_subjects;
        this._student_data.next(sd);
    }

    private set_status() {
        const sd = this.student_data_values;
        if (sd.back_subjects.length > 0) {
            sd.status = EStudentStatus.IRREGULAR;
        } else {
            sd.status = EStudentStatus.REGULAR;
        }
        this._student_data.next(sd);
    }

}

